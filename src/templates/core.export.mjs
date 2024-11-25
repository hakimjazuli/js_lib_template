// @ts-check

import { readFileSync, promises as fsPromises, writeFileSync, Dirent } from 'fs';
import { basename, extname, join as path_join } from 'path';
import chokidar from 'chokidar';
import { _Queue, _QueueObject } from '@html_first/simple_queue';

/**
 * @description
 * - class template for `auto document/export generator`;
 * > - extended class must call super on it's constructor
 * ```js
 *	export class MyClass extends {
 *		constructor(){
 *	 		super({ ...coreOptions });
 *			// ...
 *		}
 *		// ...
 *		// also you need to override any method and property prefixed with "_"
 *	}
 * ```
 * - constructor argument:
 * ```js
 * /**
 *  * @typedef {Object} coreOptions
 *  * @property {string} [coreOptions.filePath]
 *  * - realtive path from wroking directory
 *  * @property {string} [coreOptions.folderPath]
 *  * - realtive path from wroking directory
 *  * @property {string} [coreOptions.folderPathAlias]
 *  * @property {string} [coreOptions.readMePath]
 *  * - realtive path from wroking directory
 *  * @property {string} [coreOptions.tableOfContentTitle]
 *  * @property {string[]} [coreOptions.typedef]
 *  * @property {string[]} [coreOptions.copyright]
 *  * @property {string[]} [coreOptions.description]
 *  * @property {import('chokidar').WatchOptions} [coreOptions.option]
 *  *[blank]/
 * ```
 * -  we use chokidar for watching changes:
 * > - refer the options to [chokidar github](https://github.com/paulmillr/chokidar)
 * - in essence this class is a collection of method to help to do the above points, incase of you want to create your own `documentation/export generator` calling `this.createHandler`;
 * - file content detection uses `string.includes`, as I cannot get arround `regex` to allow me to use `$` as export name;
 * - `README.md` auto export rules:
 * > - has `description`;
 * > - in case you want to render empty string use [`blank`];
 * > - detectes the first `commentBlock` with `description`;
 * > - automatically turns string after last `description` of that `commentBlock` until end of the `commentBlock`;
 * > - `upperCase` OR `symbol`;
 * > - `fileName` match with `exportedName`;
 * > - `special export`:
 * > - `fileName` contains `.type.`:
 * > > only works on `language` that have `type` supports, where `declaring` and `assigning` `types` can be done on different `file`:
 * > > - will detect depends on the `handler` `@`+`coreInstance._typedefIdentifier` ... + `filename`;
 * > - `fileName` contains `.export.`:
 * > > - use to bypass `upperCase` rule:
 * - links:
 * > - auto named `h2` tag `id`, it match the `fileName` in `lowerCase`;
 * > - in this `autoExported` case `__JSDev` can be refered as `#__jsdev`;
 * > - use `namedExport` extracted files from `this.getListFilesNestedDetails` method;
 * > - run `thisInstance.run();` to start the watcher;
 * !!!WARNING
 * - copy out:
 * > - filePath: default `./index.mjs`,
 * > - readMePath: default `./README.md`,
 * > - folderPath: default `./src/*`,
 * > - `typescript` `outDir` or `package.json` `types`: default `./types/*`,
 * - of any file you might need to be unmodified, before fully knowing what this library will modify...
 */
export class core {
	queueHandler = new _Queue();
	/**
	 * @type {core}
	 */
	static __;
	/**
	 * @param {coreOptions} options
	 */
	constructor({
		filePath = './index.mjs',
		readMePath = './README.md',
		folderPath = './src',
		tableOfContentTitle = 'exported-api-and-type-list',
		copyright = [],
		description = [],
		option = {},
	}) {
		if (core.__ instanceof core) {
			console.warn({
				warning: 'this is a singleton class, you can only instantiate one of it',
				solution: 'refer to the first instance instead',
			});
			return;
		}
		this.exportedListContentTitle = tableOfContentTitle
			.toLocaleLowerCase()
			.replaceAll(/ /g, '-');
		this.goToExportedList = `\n*) <sub>[go to exported list](#${this.exportedListContentTitle})</sub>\n`;
		this.filePath = filePath;
		copyright.unshift('@copyright');
		this.readmeOpening = [...description];
		description.unshift('@description');
		this.moduleReadme = [...this.generatedString, ...copyright, ...description];
		this.commentBlockOnExportedModule = this.generateCommentBlock(this.moduleReadme);
		this.folderPath = folderPath;
		this.watcher = chokidar.watch(folderPath, option);
		this.readMePath = readMePath;
	}
	/**
	 * @type {string[]}
	 */
	moduleReadme;
	/**
	 * @private
	 * @type {RegExp}
	 */
	getFirstDescriptionBlockRegex;
	/**
	 * @readonly
	 */
	generatedString = [
		'generated using:',
		'@see {@link https://www.npmjs.com/package/@html_first/js_lib_template | @html_first/js_lib_template}',
	];
	/**
	 * @readonly
	 */
	directives = {
		typeDirective: 'type',
		exportDirective: 'export',
	};
	/**
	 * @param {Extract<keyof core["directives"], string>} directiveName
	 * @returns {string}
	 */
	makeDirective = (directiveName) => {
		return `.${this.directives[directiveName]}.`;
	};
	/**
	 * @param {string[]} extentionsWithDot
	 * @returns {Promise<(Awaited<ReturnType<core["getFileDetails"]>>)[]>}
	 */
	getListFilesNestedDetails = async (extentionsWithDot) => {
		const files = await this.walkSync(this.folderPath, extentionsWithDot);
		/**
		 * @type {(Awaited<ReturnType<core["getFileDetails"]>>)[]}
		 */
		const ret = [];
		for (let i = 0; i < files.length; i++) {
			ret.push(await this.getFileDetails(files[i]));
		}
		return ret;
	};
	/**
	 * @param {string} relativeFilePath
	 * -
	 */
	getContent = (relativeFilePath) => {
		return readFileSync(path_join('./', relativeFilePath), 'utf-8');
	};
	/**
	 * @protected
	 * @param {Dirent} dirent
	 */
	getFileDetails = async (dirent) => {
		const { parentPath, name } = dirent;
		const fileContent = this.getContent(path_join(parentPath, name));
		const filePath = path_join(parentPath, name);
		return {
			parentPath,
			name: name,
			/**
			 * @param {Extract<keyof core["directives"], string>} searchString
			 */
			containtDirective: (searchString) => name.includes(this[searchString]),
			fileContent,
			ext: extname(dirent.name),
			filePath,
			namedExport: await this.hasNamedExport(filePath, fileContent),
		};
	};
	/**
	 * @private
	 * @param {string} filePath
	 * @param {string} fileContent
	 * @return {Promise<{exportName:string, forReadMeLink:string, hasNamedExport:boolean, isValidExportName:boolean}>}
	 */
	hasNamedExport = async (filePath, fileContent) => {
		let isValidExportName = false;
		try {
			let exportName = this.getBasenameWithoutExt(filePath).split('.')[0];
			const exportPatterns_ = this._exportPatterns(exportName);
			const firstChar = exportName[0];
			if (firstChar === '_' || firstChar === '$') {
				isValidExportName = true;
			}
			if (firstChar === firstChar.toUpperCase()) {
				isValidExportName = true;
			}
			if (
				filePath.includes(this.makeDirective('exportDirective')) ||
				filePath.includes(this.makeDirective('typeDirective'))
			) {
				isValidExportName = true;
			}
			if (isValidExportName) {
				for (let pattern of exportPatterns_) {
					if (!fileContent.includes(pattern)) {
						continue;
					}
					return {
						hasNamedExport: true,
						exportName,
						forReadMeLink: exportName.toLowerCase(),
						isValidExportName,
					};
				}
			}
			return {
				hasNamedExport: false,
				exportName: '',
				forReadMeLink: exportName.toLowerCase(),
				isValidExportName,
			};
		} catch (error) {
			console.error({ message: `Error reading or parsing file ${filePath}:`, error });
			return {
				hasNamedExport: false,
				exportName: '',
				forReadMeLink: '',
				isValidExportName,
			};
		}
	};
	/**
	 * @param {string} currentPath
	 * @param {string[]} extentionsWithDot
	 * @param {import('fs').Dirent[]} result
	 * @returns {Promise<import('fs').Dirent[]>}
	 */
	walkSync = async (currentPath, extentionsWithDot, result = []) => {
		const entries = await fsPromises.readdir(currentPath, { withFileTypes: true });
		for (const entry of entries) {
			const entryPath = path_join(currentPath, entry.name);
			if (entry.isDirectory()) {
				await this.walkSync(entryPath, extentionsWithDot, result);
			}
			if (entry.isFile()) {
				for (let i = 0; i < extentionsWithDot.length; i++) {
					const extentsion = extentionsWithDot[i];
					if (entry.name.endsWith(extentsion)) {
						result.push(entry);
						break;
					}
				}
			}
		}
		return result;
	};
	/**
	 * @param {string} filePath
	 * @param {string} content
	 */
	overwriteFile = (filePath, content) => {
		try {
			writeFileSync(filePath, content, 'utf-8');
			console.log({ message: 'File Generated successfully.', filePath });
			return;
		} catch (error) {
			console.error({ error, filePath, status: 'Error overwriting file:' });
			return;
		}
	};
	/**
	 * @private
	 * @param {string} fileContent
	 * @param {string} descString
	 * @returns {string}
	 */
	getFirstDescriptionBlockUnsanitized = (fileContent, descString) => {
		const regex = new RegExp(`\\/\\*\\*([\\s\\S]*?@${descString}[\\s\\S]*?)\\*\\/`, 'g');
		const match = fileContent.match(regex);
		if (match) {
			return match[0].trim();
		}
		return '';
	};
	/**
	 * @param {Object} options
	 * @param {string} options.fileContent
	 * @param {string} [options.asReadMeExportedName]
	 * @returns {string}
	 */
	getFirstDescriptionBlock = ({ fileContent, asReadMeExportedName = '' }) => {
		const descriptionKeyword = this._descriptionKeyword;
		const goToExportedList = this.goToExportedList;
		const commentBlock = this.getFirstDescriptionBlockUnsanitized(
			fileContent,
			descriptionKeyword
		).replace(/\[blank\]/g, '');
		const regex = this.getFirstDescriptionBlockRegex;
		const match = commentBlock.match(regex);
		if (match) {
			const result = match[1]
				.replace(/^\s*\*\s?/gm, '')
				.trim()
				.replace(/\/(?![\s\S]*\/)/, '');
			if (asReadMeExportedName) {
				return `<h2 id="${asReadMeExportedName.toLowerCase()}">${asReadMeExportedName}</h2>\n\n${result}\n${goToExportedList}`;
			}
			return result;
		}
		return '';
	};
	/**
	 * @param {string} filePath
	 */
	getBasenameWithoutExt(filePath) {
		const baseNameWithExt = basename(filePath);
		return baseNameWithExt.replaceAll(extname(baseNameWithExt), '');
	}
	/**
	 * @param {string[]} lines
	 */
	generateCommentBlock(lines) {
		const commentStart = '/**';
		const commentEnd = ' */';
		const commentLines = lines.map((line) => ` * ${line}`).join('\n');
		return `${commentStart}\n${commentLines}\n${commentEnd}`;
	}
	/**
	 * @type {string}
	 */
	typeDirective = this.makeDirective('typeDirective');
	/**
	 * @type {string}
	 */
	exportDirective = this.makeDirective('exportDirective');
	/**
	 * @private
	 * @param {() => Promise<void>} processFiles
	 */
	handler = async (processFiles) => {
		this.queueHandler.assign(
			new _QueueObject(
				'path',
				async () => {
					await processFiles();
				},
				300
			)
		);
	};
	run = async () => {
		this.getFirstDescriptionBlockRegex = new RegExp(
			`@${this._descriptionKeyword}(?:[\\s\\S]*?@${this._descriptionKeyword})?\\s*([\\s\\S]*)`
		);
		const handler_ = async () => {
			await this.handler(this.processFiles);
		};
		this.watcher.on('add', handler_).on('change', handler_);
	};
	/**
	 * @type {import('chokidar').FSWatcher}
	 */
	watcher;
	/**
	 * @type {string}
	 */
	readMePath;
	/**
	 * @type {string}
	 */
	folderPath;
	/**
	 * @type {string}
	 */
	filePath;
	/**
	 * @protected
	 * @type {string}
	 */
	commentBlockOnExportedModule;
	/**
	 * @type {string}
	 */
	goToExportedList;

	/**
	 * @protected
	 * @param {string} fileContent
	 * @param {string} exportName
	 * @returns {RegExpMatchArray|null}
	 */
	getTypeDefsOnDirectiveFile = (fileContent, exportName) => {
		return fileContent.match(
			new RegExp(
				`\/\\*\\*[\\s\\S]*?@${this._typedefIdentifier}[\\s\\S]*?${
					exportName.split('.')[0]
				}[\\s\\S]*?\\*\\/`
			)
		);
	};
	/**
	 * @param {string} exportName
	 * @returns {string[]}
	 */
	_exportPatterns = (exportName) => {
		console.warn({
			childInstance: this.constructor.name,
			processFiles: '`_exportPatterns` method is not defined in `childInstance`',
		});
		return [''];
	};
	processFiles = async () => {
		const folderPath = this.folderPath;
		try {
			await this._processFiles();
		} catch (error) {
			console.error({ error, folderPath });
		}
		return;
	};
	/**
	 * @protected
	 * @return {Promise<void>}
	 */
	_processFiles = async () => {
		console.warn({
			childInstance: this.constructor.name,
			processFiles: '`_processFiles` method is not defined in `childInstance`',
		});
	};
	/**
	 * @type {string}
	 */
	_typedefIdentifier;
	/**
	 * @type {string}
	 */
	_descriptionKeyword;
}
