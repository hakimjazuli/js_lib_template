/**
 * @description
 * - `extended` from [core](#core)
 * - [singleton_instantiate_to_run](#singleton_instantiate_to_run);
 * - `fileName` contains `.type.` detects `@`+`see` + ... + `fileName`;
 * - using class instantiation, generate single `markdown` documentation for `PHP`;
 * > - on comment after `@see` throught the end of comment will be added;
 * - supports nesting;
 * - additional base setup;
 * - example file setting:
 * ```js
 * // ./dev/index.mjs
 * // @ts-check
 *
 * import { __PHPDev } from '@html_first/js_lib_template';
 *
 * new __PHPDev({
 *	 folderPath: './src',
 *	 readMePath: './README.md',
 *   description: ['## HOW TO INSTALL','```shell,'composer require author/package-name',```'].
 * }).run();
 * ```
 * - saving script for convenience:
 * ```js
 * // package.json
 * {
 * ...
 *	"scripts": {
 *	...
 *		"dev": "concurrently \"bun --watch ./dev/index.mjs\" \"bun tsc --watch\""
 *	...
 *	},
 *}
 * ...
 * ```
 * - starts watching:
 * ```shell
 * bun dev
 * // or
 * npm run dev
 * ```
 */
export class __PHPDev extends core {
    /**
     * @type {__PHPDev}
     */
    static __: __PHPDev;
    /**
     * @private
     * @param {string} fileContent
     * @returns {string}
     */
    private getNameSpace;
}
import { core } from '../templates/core.export.mjs';
