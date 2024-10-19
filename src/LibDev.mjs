// @ts-check

import chokidar from 'chokidar';
import { readFile } from 'fs/promises';
import { promises as fs } from 'fs';
import { basename, extname, join } from 'path';
import { _Queue, _QueueObject } from '@html_first/simple_queue';
import { log } from 'console';

/**
 * @description
 * - class API to watch for file changes
 * -  we use chokidar for watching changes:
 * > - refer the options to [chokidar github](https://github.com/paulmillr/chokidar)
 * ```js
 *     constructor({ filePath, readMePath, folderPath, copyright, description, option, }: {
 *       filePath: string;
 *       folderPath?: string;
 *       readMePath?: string;
 *       copyright?: string[];
 *       description?: string[];
 *       option?: import("chokidar").WatchOptions;
 *    });
 *	```
 *
 * - the exported API should contains match literally:
 * ```js
 *	const exportPatterns = [
 *		`export class ${exportName}`,
 *		`export const ${exportName}`,
 *		`export function ${exportName}`,
 *	];
 * ```
 * > - no `var` or `let` as it should not be reassigned;
 * > - this detection uses `string.includes`, as I cannot get arround `regex` to allow me to use `$` as export name;
 * - auto export rules:
 * > - has `description`;
 * > > - detectes the first `commentBlock` with `description`;
 * > > - automatically turns after last `description` of that `commentBlock` until end of the `commentBlock`;
 * > - `upperCase` OR `symbol`;
 * > - `fileName` match with `exportedName`;
 * > - `special export`:
 * > > - `fileName` contains `.type.`:
 * > > > - detect first comment block with `typedef` of matched `fileName`(without `.type.`)
 * > > - `fileName` contains `.export.`:
 * > > > - bypassing `upperCase` rule:
 * - links:
 * > - auto named `h2` tag `id`, it match the `fileName` in `lowerCase`;
 * > - in this `autoExported` `LibDev` can be refered as `#libdev`;
 */
export class LibDev {
	/**
	 * @private
	 * @readonly
	 */
	static generatedString = [
		'generated using:',
		'@see {@link https://www.npmjs.com/package/@html_first/js_lib_template | @html_first/js_lib_template}',
	];
	/**
	 * @type {LibDev}
	 */
	static __;
	static exportedListContent;
	/**
	 * @param {Object} a0
	 * @param {string} a0.filePath
	 * - realtive path
	 * @param {string} [a0.folderPath]
	 * - realtive path
	 * @param {string} [a0.readMePath]
	 * - realtive path
	 * @param {string} [a0.tableOfContentTitle]
	 * @param {string[]} [a0.copyright]
	 * @param {string[]} [a0.description]
	 * @param {import('chokidar').WatchOptions} [a0.option]
	 */
	constructor({
		filePath,
		readMePath = '',
		folderPath = './src',
		tableOfContentTitle = 'exported-api-and-type-list',
		copyright = [],
		description = [],
		option = {},
	}) {
		if (LibDev.__ instanceof LibDev) {
			console.warn({
				warning: 'this is a singleton class, you can only instantiate one of it',
				solution: 'refer to the first instance instead',
			});
			return;
		}
		LibDev.exportedListContent = tableOfContentTitle.toLocaleLowerCase().replaceAll(/ /g, '-');
		LibDev.goToExportedList = `\n*) <sub>[go to exported list](#${LibDev.exportedListContent})</sub>\n`;
		this.filePath = filePath;
		copyright.unshift('@copyright');
		description.unshift('@description');
		const comments = [...LibDev.generatedString, ...copyright, ...description];
		this.comment = LibDev.generateCommentBlock(comments);
		this.folderPath = folderPath;
		this.watcher = chokidar.watch(folderPath, option);
		this.queueHandler = new _Queue();
		this.readMePath = readMePath;
		this.createHandler();
	}
	/**
	 * @private
	 * @type {string}
	 */
	readMePath;
	/**
	 * @private
	 * @type {string}
	 */
	folderPath;
	/**
	 * @private
	 * @type {string}
	 */
	filePath;
	/**
	 * @private
	 * @type {_Queue}
	 */
	queueHandler;
	/**
	 * @private
	 * @type {string}
	 */
	comment;
	/**
	 * @private
	 * @type {chokidar.FSWatcher}
	 */
	watcher;
	/**
	 * @private
	 */
	createHandler = async () => {
		this.watcher
			.on('add', async (path_) => {
				await this.handle(path_);
			})
			.on('change', async (path_) => {
				await this.handle(path_);
			});
	};
	/**
	 * @private
	 */
	static directives = {
		typesIdentifier: 'type',
		forcedExport: 'export',
	};
	/**
	 * @private
	 * @param {Extract<keyof LibDev.directives, string>} directiveName
	 * @returns {string}
	 */
	static makeDirective = (directiveName) => {
		return `.${LibDev.directives[directiveName]}.`;
	};
	/**
	 * @private
	 * @param {string} path_
	 */
	handle = async (path_) => {
		switch (true) {
			case path_.includes(LibDev.makeDirective('typesIdentifier')):
			case path_.includes(LibDev.makeDirective('forcedExport')):
				break;
			case !(await LibDev.hasNamedExport(path_)):
				return;
		}
		this.queueHandler.assign(
			new _QueueObject(
				'path',
				async () => {
					await this.listFilesInFolder();
				},
				300
			)
		);
	};
	/**
	 * @private
	 * @param {string[]} lines
	 */
	static generateCommentBlock(lines) {
		const commentStart = '/**';
		const commentEnd = ' */';
		const commentLines = lines.map((line) => ` * ${line}`).join('\n');
		return `${commentStart}\n${commentLines}\n${commentEnd}`;
	}
	/**
	 * @private
	 */
	listFilesInFolder = async () => {
		const folderPath = this.folderPath;
		try {
			const files = await fs.readdir(folderPath, { withFileTypes: true });
			const import_ = [];
			const export_ = [];
			const types_ = [];
			const readMe_ = [];
			const exportedAPI = [];
			const typesIdentifier = LibDev.makeDirective('typesIdentifier');
			const forcedExport = LibDev.makeDirective('forcedExport');
			for (const file of files) {
				if (file.isFile()) {
					let baseName = basename(file.name, extname(file.name));
					switch (true) {
						case file.name.includes(typesIdentifier):
						case file.name.includes(forcedExport):
						case baseName[0] === baseName[0].toUpperCase():
							break;
						case baseName[0] === baseName[0].toLowerCase():
							continue;
					}
					const extWithDot = extname(file.name);
					if (file.name.includes(typesIdentifier)) {
						const fileContent = await LibDev.getContent(join(folderPath, file.name));
						const name = file.name.replaceAll(
							(typesIdentifier + extWithDot).replaceAll('..', '.'),
							''
						);
						if (fileContent) {
							const readMeString = LibDev.readMeString(fileContent, name);
							if (readMeString) {
								readMe_.push(readMeString);
								exportedAPI.push(name);
							}
						}
						const allComments = fileContent.match(
							new RegExp(
								`\/\\*\\*[\\s\\S]*?@typedef[\\s\\S]*?${name}[\\s\\S]*?\\*\\/`
							)
						);
						if (allComments) {
							types_.push(allComments.join('\n'));
						}
					} else {
						const fileContent = await LibDev.getContent(join(folderPath, file.name));
						let moduleName = baseName;
						if (file.name.includes(forcedExport)) {
							moduleName = file.name.replaceAll(
								(forcedExport + extWithDot).replaceAll('..', '.'),
								''
							);
						}
						if (fileContent) {
							const readMeString = LibDev.readMeString(fileContent, moduleName);
							if (readMeString) {
								readMe_.push(LibDev.readMeString(fileContent, moduleName));
								exportedAPI.push(moduleName);
							}
						}
						if (extWithDot == '.ts' || extWithDot == '.mts') {
							import_.push(
								`import { ${moduleName} } from './${join(
									folderPath,
									baseName
								).replaceAll(/\\/g, '/')}';`
							);
						}
						if (extWithDot == '.mjs') {
							import_.push(
								`import { ${moduleName} } from './${join(
									folderPath,
									baseName + extWithDot
								).replaceAll(/\\/g, '/')}';`
							);
						}
						export_.push(moduleName);
					}
				}
			}
			let tsCheckString;
			switch (true) {
				case this.filePath.includes('.ts'):
				case this.filePath.includes('.mts'):
					tsCheckString = '';
					break;
				default:
					tsCheckString = '// @ts-check\n\n';
					break;
			}
			const types__ = types_.length ? '\n\n' + types_.join('\n') + '\n' : '';
			const fileString = `${tsCheckString}${this.comment}\n\n${import_.join(
				'\n'
			)}${types__}\nexport { ${export_.join(', ')} };`.replaceAll(
				/import\((['"])\.\//g,
				'import($1./src'
			);
			if (this.readMePath) {
				for (let i = exportedAPI.length - 1; i >= 0; i--) {
					const exportedAPI_ = exportedAPI[i];
					readMe_.unshift(`- [${exportedAPI_}](#${exportedAPI_.toLocaleLowerCase()})`);
				}
				readMe_.unshift(
					`<h2 id="${LibDev.exportedListContent}">${LibDev.exportedListContent}</h2>`
				);
				readMe_.unshift(LibDev.readMeString(this.comment));
				const readMeString = readMe_.join('\n\n');
				await LibDev.overwriteFileAsync(this.readMePath, readMeString);
			}
			await LibDev.overwriteFileAsync(this.filePath, fileString);
		} catch (error) {
			console.error(`Error reading directory ${folderPath}:`, error);
		}
		return;
	};
	/**
	 * @private
	 * @param {string} fileString
	 * @returns {string}
	 */
	static getFirstDescriptionBlock = (fileString) => {
		const regex = /\/\*\*([\s\S]*?@description[\s\S]*?)\*\//;
		const match = fileString.match(regex);
		if (match) {
			return match[0].trim();
		}
		return '';
	};
	/**
	 * @private
	 * @type {string}
	 */
	static goToExportedList;
	/**
	 * @private
	 * @param {string} fileString
	 * @param {string} [fileName]
	 * @returns {string}
	 */
	static readMeString = (fileString, fileName = '') => {
		const commentBlock = LibDev.getFirstDescriptionBlock(fileString);
		const regex = /@description(?:[\s\S]*@description)?\s*([\s\S]*)/;
		const match = commentBlock.match(regex);
		if (match) {
			const result = match[1]
				.replaceAll(/^\s*\*\s?/gm, '')
				.trim()
				.replaceAll(/\/(?![\s\S]*\/)/, '');
			if (fileName) {
				return `<h2 id="${fileName.toLowerCase()}">${fileName}</h2>\n${
					LibDev.goToExportedList
				}\n${result}\n${LibDev.goToExportedList}`;
			}
			return result;
		}
		return '';
	};
	/**
	 * @private
	 * @param {string} filePath
	 * @param {string} content
	 */
	static overwriteFileAsync = async (filePath, content) => {
		try {
			await fs.writeFile(filePath, content, 'utf-8');
			console.log({ message: 'File Generated successfully.', filePath });
			return;
		} catch (error) {
			console.error({ error, filePath, status: 'Error overwriting file:' });
			return;
		}
	};
	/**
	 * @private
	 * @param {string} filePath
	 */
	static getBasenameWithoutExt(filePath) {
		const baseNameWithExt = basename(filePath);
		return baseNameWithExt.replaceAll(extname(baseNameWithExt), '');
	}
	/**
	 * @private
	 * @param {string} path_
	 */
	static getContent = async (path_) => {
		return await readFile(path_, 'utf-8');
	};
	/**
	 * @private
	 * @param {string} path_
	 */
	static hasNamedExport = async (path_) => {
		try {
			const code = await LibDev.getContent(path_);
			let exportName = LibDev.getBasenameWithoutExt(path_);
			const exportPatterns = [
				`export class ${exportName}`,
				`export const ${exportName}`,
				`export function ${exportName}`,
			];
			for (const pattern of exportPatterns) {
				if (code.includes(pattern)) {
					return true;
				}
			}
			return false;
		} catch (error) {
			console.error(`Error reading or parsing file ${path_}:`, error);
			return false;
		}
	};
}
