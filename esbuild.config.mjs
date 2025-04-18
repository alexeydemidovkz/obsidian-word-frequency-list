import esbuild from "esbuild";
import process from "process";
import builtins from 'builtin-modules';

const banner = 
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === 'production');

esbuild.build({
	banner: {
		js: banner,
	},
	entryPoints: ['main.ts'],
	outfile: 'main.js',
	external: [
		'obsidian',
		'electron',
		'@electron/remote',
		...builtins
	],
	format: 'cjs',
	bundle: true,
	logLevel: "info",
	sourcemap: prod ? false : 'inline',
}).catch(() => process.exit(1)); 