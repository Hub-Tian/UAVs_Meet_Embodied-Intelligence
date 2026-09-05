import { build } from 'esbuild';
import { cp, mkdir } from 'node:fs/promises';

// Keep a browser-ready bundle in assets for the existing root-based Pages workflow.
await build({
  entryPoints: ['assets/js/scene/mountain-scene.js'],
  outfile: 'assets/js/mountain-scene.bundle.js',
  bundle: true, minify: true, format: 'iife', target: 'es2020', legalComments: 'eof'
});
await mkdir('dist', { recursive: true });
for (const path of ['index.html', 'assets', 'data']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log('BUILD PASS: static site in dist; local Three.js bundle updated.');
