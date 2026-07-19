/**
 * Prose micro-format shared by season-2 stories.
 *
 * Scenes are authored as plain strings: blank lines separate blocks, a block
 * of `- ` lines is a list, a `$$...$$` block is display math, and inline
 * `**bold**` / `$math$` spans are parsed. Season 1 embedded this parser in
 * CoolingCurveStory; it is now the shared story-kit seed.
 */

export interface InlineSegment {
	type: 'text' | 'strong' | 'math';
	value: string;
}

export type ProseBlock =
	| { kind: 'p'; segments: InlineSegment[] }
	| { kind: 'math'; formula: string }
	| { kind: 'list'; items: InlineSegment[][] };

export function parseInline(text: string): InlineSegment[] {
	const segments: InlineSegment[] = [];
	const pattern = /(\*\*[^*]+\*\*|\$[^$]+\$)/g;
	let last = 0;
	let match: RegExpExecArray | null;
	while ((match = pattern.exec(text)) !== null) {
		if (match.index > last) segments.push({ type: 'text', value: text.slice(last, match.index) });
		const token = match[0];
		if (token.startsWith('**')) segments.push({ type: 'strong', value: token.slice(2, -2) });
		else segments.push({ type: 'math', value: token.slice(1, -1) });
		last = match.index + token.length;
	}
	if (last < text.length) segments.push({ type: 'text', value: text.slice(last) });
	return segments;
}

export function parseProse(prose: string): ProseBlock[] {
	return prose.split(/\n\s*\n/).map((block) => {
		const trimmed = block.trim();
		if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
			return { kind: 'math' as const, formula: trimmed.slice(2, -2).trim() };
		}
		const lines = trimmed.split('\n');
		if (lines.length > 1 && lines.every((line) => line.trim().startsWith('- '))) {
			return {
				kind: 'list' as const,
				items: lines.map((line) => parseInline(line.trim().slice(2)))
			};
		}
		return { kind: 'p' as const, segments: parseInline(trimmed) };
	});
}
