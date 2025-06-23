// @ts-check

import { core } from '../templates/core.export.mjs';

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
	static __;
	/**
	 * @param {import('../templates/core.export.mjs').coreOptions} options
	 */
	constructor(options) {
		super(options);
		this.run();
	}
	_typedefIdentifier = 'typedef';
	_descriptionKeyword = 'description';

	/**
	 * @param {string} exportName
	 * @returns {string[]}
	 */
	_exportPatterns = (exportName) => [
		`export class ${exportName}`,
		`export const ${exportName}`,
		`export function ${exportName}`,
	];

	_processFiles = async () => {
		const files = await this.getListFilesNestedDetails(['.mjs', '.ts', '.mts']);
		const readmeFile = [...this.readmeOpening];
		const jumpTos = [];
		const readMeModuleDetails = [];
		const exportedFile = ['// @ts-check'];
		const exportedImports = [];
		const exportedTypes = [];
		const exportedModule = [];
		const createReadMeFile = () => {
			readmeFile.push(`## ${this.exportedListContentTitle}`);
			readmeFile.push(...jumpTos);
			readmeFile.push(...readMeModuleDetails);
			this.overwriteFile(this.readMePath, readmeFile.join('\n').replace(/\[blank\]/g, ''));
		};
		const createExportedFile = async () => {
			exportedFile.push(this.commentBlockOnExportedModule);
			exportedFile.push(...exportedImports);
			exportedFile.push(...exportedTypes);
			exportedFile.push(...exportedModule);
			this.overwriteFile(this.filePath, exportedFile.join('\n'));
		};
		for (let i = 0; i < files.length; i++) {
			const { containtDirective, name, parentPath, fileContent, namedExport } = files[i];
			const { exportName, hasNamedExport, forReadMeLink, isValidExportName } = namedExport;
			if (containtDirective('typeDirective')) {
				if (!isValidExportName) {
					continue;
				}
				const typeDef = this.getTypeDefsOnDirectiveFile(parentPath, fileContent, exportName);
				exportedTypes.push(...typeDef);
			} else {
				const desciptionBlock = this.getFirstDescriptionBlock({
					fileContent,
					asReadMeExportedName: exportName,
				});
				if (!hasNamedExport) {
					continue;
				}
				if (desciptionBlock) {
					jumpTos.push(`- [${exportName}](#${forReadMeLink})`);
					readMeModuleDetails.push(desciptionBlock);
				}
				if (isValidExportName) {
					exportedImports.push(
						`export { ${exportName} } from '${parentPath.replace(/\\/g, '/')}/${name}';`
					);
				}
			}
		}
		createReadMeFile();
		createExportedFile();
	};
}
