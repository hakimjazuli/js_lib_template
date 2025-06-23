// @ts-check

import { _Queue } from '@html_first/simple_queue';
import { core } from '../templates/core.export.mjs';

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
 *   description: ['## HOW TO INSTALL','```shell','composer require author/package-name','```'].
 * }).run();
 * ```
 * - saving script for convenience:
 * ```js
 * // package.json
 * {
 * ...
 *	"scripts": {
 *	...
 *		"dev": "bun --watch ./dev/index.mjs"
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
	static __;
	/**
	 * @param {import('../templates/core.export.mjs').coreOptions} options
	 */
	constructor(options) {
		super({ ...options, tableOfContentTitle: 'exported-api-by-namespace' });
		if (__PHPDev.__ instanceof __PHPDev) {
			return;
		}
		__PHPDev.__ = this;
		if (!options.readMePath) {
			console.warn({
				readMePath: options.readMePath,
				error: '`__PHPDev` require filepath to generate auto export',
			});
			return;
		}
	}
	/**
	 * @private
	 * @param {string} fileContent
	 * @returns {string}
	 */
	getNameSpace = (fileContent) => {
		const namespaceRegex = /namespace\s+([\w\\]+)\s*;/;
		const match = fileContent.match(namespaceRegex);
		return match ? match[1] : '';
	};
	_descriptionKeyword = 'see';
	/**
	 * @param {string} exportName
	 * @returns {string[]}
	 */
	_exportPatterns = (exportName) => [
		`interface ${exportName}`,
		`trait ${exportName}`,
		`class ${exportName}`,
	];
	_typedefIdentifier = 'see';
	_processFiles = async () => {
		const files = await this.getListFilesNestedDetails(['.php']);
		const readmeFile = [...this.readmeOpening];
		const jumpTos = [];
		const readMeModuleDetails = [];
		const generateReadme = () => {
			readmeFile.push(`## ${this.exportedListContentTitle}`);
			readmeFile.push(...jumpTos);
			readmeFile.push(...readMeModuleDetails);
			this.overwriteFile(this.readMePath, readmeFile.join('\n\n').replace(/\[blank\]/g, ''));
		};
		for (let i = 0; i < files.length; i++) {
			const { fileContent, namedExport } = files[i];
			const { exportName, hasNamedExport, isValidExportName } = namedExport;
			if (!isValidExportName || !hasNamedExport) {
				continue;
			}
			const desciptionBlock = this.getFirstDescriptionBlock({
				fileContent,
			});
			const namespace = `${this.getNameSpace(fileContent)}\\${exportName}`;
			const link = namespace.replace(/\\/g, '_').toLowerCase();
			jumpTos.push(`- [${namespace}](#${link})`);
			readMeModuleDetails.push(`<h2 id="${link}">${namespace}</h2>`);
			readMeModuleDetails.push(desciptionBlock);
			readMeModuleDetails.push(this.goToExportedList);
		}
		generateReadme();
	};
}
