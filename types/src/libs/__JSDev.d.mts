/**
 * @description
 * - `extended` from [core](#core)
 * - [singleton_instantiate_to_run](#singleton_instantiate_to_run);
 * - `fileName` contains `.type.` detects `@`+`typedef` + ... + `fileName`;
 * - supports nested folders;
 * - targets [`'*.mjs'`, `'*.ts'`, `'*.mts'`] `files`;
 * - `instantiate` class API to watch for file changes;
 * - the exported API should contains match literally:
 * ```js
 *	/**
 *	 * @param {string} exportName
 *	 * @returns {string[]}
 *	 *[blank]/
 *	exportPatterns = (exportName) => [
 *		`export class ${exportName}`,
 *		`export const ${exportName}`,
 *		`export function ${exportName}`,
 *	];
 * ```
 * - doesn't support `var` or `let`, for semantics;
 * - supports for [`"*.mjs"`, `"*.ts",` `"*.mts"`];
 * - `fileName` contains `.type.` detects `@`+`typedef` + ... +  `fileName`;
 * - additional base setup for js developement:
 * > - generate `types`;
 * ```js
 * // tsconfig.js
 *{
 *	"compilerOptions": {
 *		"allowJs": true,
 *		"declaration": true,
 *		"emitDeclarationOnly": true,
 *		"outDir": "./types",
 *		"module": "ESNext",
 *		"target": "ES2020",
 *		"moduleResolution": "node",
 *		"esModuleInterop": true,
 *		"skipLibCheck": true,
 *		"baseUrl": "."
 *	},
 *	"include": [filePathOptionValue]
 *}
 * ```
 * > - generation script
 * ```js
 * // package.json
 *{
 *	...
 *	"main": "index.mjs",
 *	"types": "./types/index.d.mts",
 *	"module": "index.mjs",
 *	"type": "module",
 *	...
 *	"scripts": {
 *		"dev": "concurrently \"bun --watch ./dev/index.mjs\" \"bun tsc --watch\""
 *	},
 *	...
 *}
 * ```
 * - with type definition it can also check for:
 * > - if there are any name colision, as we don't support aliases exports;
 * > - allow your library user to set `skiplibChecks: false` on their `typescript` configuration;
 */
export class __JSDev extends core {
    /**
     * @type {__JSDev}
     */
    static __: __JSDev;
}
import { core } from '../templates/core.export.mjs';
