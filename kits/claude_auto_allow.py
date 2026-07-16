"""Auto-click Claude's highlighted Yes permission row in Antigravity on Windows.

Safety gates:
1. The foreground window title must contain Antigravity or Claude.
2. A large blue horizontal selection row must be visible in the dialog area.
3. The same row must be detected in two consecutive frames.

Press Ctrl+Alt+Q to stop the background process.
"""

from __future__ import annotations

import argparse
import ctypes
import os
import re
import sys
import time
from ctypes import wintypes
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import ImageGrab


USER32 = ctypes.windll.user32
SCRIPT_PATH = Path(__file__).resolve()
PID_PATH = SCRIPT_PATH.with_suffix(".pid")
LOG_PATH = SCRIPT_PATH.with_suffix(".log")

VK_CONTROL = 0x11
VK_MENU = 0x12
VK_Q = 0x51
MOUSEEVENTF_LEFTDOWN = 0x0002
MOUSEEVENTF_LEFTUP = 0x0004


def enable_dpi_awareness() -> None:
    try:
        ctypes.windll.shcore.SetProcessDpiAwareness(2)
    except (AttributeError, OSError):
        try:
            USER32.SetProcessDPIAware()
        except (AttributeError, OSError):
            pass


def log(message: str) -> None:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        with LOG_PATH.open("a", encoding="utf-8") as handle:
            handle.write(f"[{timestamp}] {message}\n")
    except OSError:
        pass
    if sys.stdout and sys.stdout.isatty():
        print(message, flush=True)


def foreground_title() -> str:
    hwnd = USER32.GetForegroundWindow()
    length = USER32.GetWindowTextLengthW(hwnd)
    buffer = ctypes.create_unicode_buffer(length + 1)
    USER32.GetWindowTextW(hwnd, buffer, len(buffer))
    return buffer.value


def key_down(key_code: int) -> bool:
    return bool(USER32.GetAsyncKeyState(key_code) & 0x8000)


def stop_hotkey_pressed() -> bool:
    return key_down(VK_CONTROL) and key_down(VK_MENU) and key_down(VK_Q)


def grouped_true_ranges(values: np.ndarray) -> list[tuple[int, int]]:
    padded = np.pad(values.astype(np.int8), (1, 1))
    changes = np.diff(padded)
    starts = np.flatnonzero(changes == 1)
    ends = np.flatnonzero(changes == -1)
    return list(zip(starts.tolist(), ends.tolist()))


def find_blue_yes_bar(image: np.ndarray) -> tuple[int, int, int, int] | None:
    height, width, _ = image.shape
    x_limit = int(width * 0.72)
    y_start = int(height * 0.36)
    y_end = int(height * 0.90)
    roi = image[y_start:y_end, :x_limit]

    red = roi[:, :, 0].astype(np.int16)
    green = roi[:, :, 1].astype(np.int16)
    blue = roi[:, :, 2].astype(np.int16)

    # Matches VS Code-style selection blue while excluding grey dialog surfaces.
    mask = (
        (blue >= 135)
        & (green >= 60)
        & (red <= 105)
        & ((blue - red) >= 70)
        & ((blue - green) >= 25)
    )

    row_threshold = max(180, int(width * 0.20))
    active_rows = mask.sum(axis=1) >= row_threshold
    candidates: list[tuple[float, tuple[int, int, int, int]]] = []

    for local_top, local_bottom in grouped_true_ranges(active_rows):
        bar_height = local_bottom - local_top
        if not int(height * 0.022) <= bar_height <= int(height * 0.085):
            continue

        row_block = mask[local_top:local_bottom]
        active_columns = row_block.mean(axis=0) >= 0.62
        for left, right in grouped_true_ranges(active_columns):
            bar_width = right - left
            if not int(width * 0.25) <= bar_width <= int(width * 0.68):
                continue
            if left > int(width * 0.18):
                continue

            fill_ratio = float(row_block[:, left:right].mean())
            aspect_ratio = bar_width / max(bar_height, 1)
            if fill_ratio < 0.72 or aspect_ratio < 7.0:
                continue

            top = y_start + local_top
            bottom = y_start + local_bottom
            score = fill_ratio * bar_width - abs(top - int(height * 0.66)) * 0.1
            candidates.append((score, (left, top, right, bottom)))

    if not candidates:
        return None
    return max(candidates, key=lambda item: item[0])[1]


def click_bar(bounds: tuple[int, int, int, int]) -> None:
    left, top, right, bottom = bounds
    target_x = (left + right) // 2
    target_y = (top + bottom) // 2

    original = wintypes.POINT()
    USER32.GetCursorPos(ctypes.byref(original))
    USER32.SetCursorPos(target_x, target_y)
    USER32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    USER32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
    time.sleep(0.08)
    USER32.SetCursorPos(original.x, original.y)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true", help="Detect but do not click.")
    parser.add_argument("--once", action="store_true", help="Check one frame and exit.")
    parser.add_argument("--interval", type=float, default=0.35, help="Seconds between checks.")
    parser.add_argument("--cooldown", type=float, default=1.5, help="Seconds after each click.")
    parser.add_argument(
        "--title",
        default=r"antigravity|claude",
        help="Case-insensitive foreground-window title regex.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    enable_dpi_awareness()
    title_pattern = re.compile(args.title, re.IGNORECASE)

    PID_PATH.write_text(str(os.getpid()), encoding="ascii")
    log(f"Started pid={os.getpid()} dry_run={args.dry_run}")

    previous: tuple[int, int, int, int] | None = None
    consecutive = 0

    try:
        while True:
            if stop_hotkey_pressed():
                log("Stopped by Ctrl+Alt+Q")
                return 0

            title = foreground_title()
            bounds = None
            if title_pattern.search(title):
                frame = np.asarray(ImageGrab.grab().convert("RGB"))
                bounds = find_blue_yes_bar(frame)

            if bounds is not None:
                close_to_previous = previous is not None and all(
                    abs(current - old) <= 8 for current, old in zip(bounds, previous)
                )
                consecutive = consecutive + 1 if close_to_previous else 1
                previous = bounds

                if args.once or consecutive >= 2:
                    log(f"Detected title={title!r} bounds={bounds}")
                    if not args.dry_run:
                        click_bar(bounds)
                        log("Clicked highlighted Yes row")
                    if args.once:
                        return 0
                    previous = None
                    consecutive = 0
                    time.sleep(max(args.cooldown, 0.1))
            else:
                previous = None
                consecutive = 0
                if args.once:
                    log(f"No approval row detected; foreground={title!r}")
                    return 1

            time.sleep(max(args.interval, 0.1))
    except KeyboardInterrupt:
        log("Stopped by keyboard interrupt")
        return 0
    except Exception as exc:
        log(f"Fatal error: {type(exc).__name__}: {exc}")
        return 2
    finally:
        try:
            if PID_PATH.exists() and PID_PATH.read_text(encoding="ascii").strip() == str(os.getpid()):
                PID_PATH.unlink()
        except OSError:
            pass


if __name__ == "__main__":
    raise SystemExit(main())
