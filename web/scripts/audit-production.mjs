import { spawn } from 'node:child_process';

const basePath = '/visual-chem';
const port = 4173;
const origin = `http://127.0.0.1:${port}${basePath}`;
const sharedEnv = {
	...process.env,
	BASE_PATH: basePath,
	NODE_OPTIONS: process.env.NODE_OPTIONS ?? '--max-old-space-size=768 --max-semi-space-size=8'
};

function run(command, args, env = sharedEnv) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { stdio: 'inherit', env });
		child.once('error', reject);
		child.once('exit', (code, signal) => {
			if (code === 0) resolve();
			else reject(new Error(`${command} ${args.join(' ')} exited with ${code ?? signal}`));
		});
	});
}

function runNpm(args) {
	if (process.platform === 'win32') {
		return run(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', `npm.cmd ${args.join(' ')}`]);
	}
	return run('npm', args);
}

async function waitForServer(url, timeoutMs = 15000) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		try {
			const response = await fetch(url, { redirect: 'manual' });
			if (response.status >= 200 && response.status < 400) return;
		} catch {
			// Server is still starting.
		}
		await new Promise((resolve) => setTimeout(resolve, 250));
	}
	throw new Error(`Timed out waiting for ${url}`);
}

console.log(`Building and auditing the Pages artifact at ${origin}/`);
await runNpm(['run', 'build']);

const server = spawn(process.execPath, ['scripts/serve-pages.mjs'], {
	stdio: 'inherit',
	env: { ...sharedEnv, PORT: String(port) }
});

try {
	await waitForServer(`${origin}/`);
	await run(process.execPath, ['scripts/capture-audit.mjs'], {
		...sharedEnv,
		VISUAL_CHEM_ORIGIN: origin
	});
} finally {
	server.kill();
}
