// @ts-check

import chokidar from 'chokidar';
import { readFile } from 'fs/promises';
import { promises as fs } from 'fs';
import { basename, extname, join } from 'path';
import { _Queue, _QueueObject } from '@html_first/simple_queue';

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
	 * @param {{
	 * relativeFilePath:string,
	 * relativeFolderPath?:string,
	 * copyright?:string[],
	 * description?:string[],
	 * chokidarWatchOptions?:import('chokidar').WatchOptions,
	 * }} param0
	 * - all string path is relative to active working directory;
	 */
	constructor({
		relativeFilePath,
		relativeFolderPath = './src',
		copyright = [],
		description = [],
		chokidarWatchOptions = {},
	}) {
		this.filePath = relativeFilePath;
		copyright.unshift('@copyright:');
		copyright.push(';;;');
		description.unshift('@description:');
		description.push(';;;');
		const comments = [...LibDev.generatedString, ...copyright, ...description];
		this.comments = LibDev.generateCommentBlock(comments);
		this.folderPath = relativeFolderPath;
		this.watcher = chokidar.watch(relativeFolderPath, chokidarWatchOptions);
		this.queueHandler = new _Queue();
		this.createHandler();
	}
	/**
	 * @private
	 */
	folderPath;
	/**
	 * @private
	 */
	filePath;
	/**
	 * @private
	 * @type {_Queue}
	 */
	queueHandler;
	/**
	 * @private
	 */
	comments;
	/**
	 * @private
	 */
	watcher;
	/**
	 * @private
	 */
	createHandler = async () => {
		this.watcher
			.on('add', async (path_) => {
				this.handle(path_);
			})
			.on('change', async (path_) => {
				this.handle(path_);
			});
	};
	/**
	 * @private
	 * @readonly
	 */
	static typesIdentifier = '.type.';
	/**
	 * @private
	 * @param {string} path_
	 */
	handle = async (path_) => {
		switch (true) {
			case path_.includes(LibDev.typesIdentifier):
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
			for (const file of files) {
				if (file.isFile()) {
					const baseName = basename(file.name, extname(file.name));
					switch (true) {
						case file.name.includes(LibDev.typesIdentifier):
						case baseName[0] === baseName[0].toUpperCase():
							break;
						case baseName[0] === baseName[0].toLowerCase():
							continue;
					}
					const extWithDot = extname(file.name);
					if (file.name.includes(LibDev.typesIdentifier)) {
						const fileContent = await LibDev.getContent(join(folderPath, file.name));
						const name = file.name.replace(
							(LibDev.typesIdentifier + extWithDot).replace('..', '.'),
							''
						);
						const allComments = fileContent.match(
							new RegExp(
								`\/\\*\\*[\\s\\S]*?@typedef[\\s\\S]*?${name}[\\s\\S]*?\\*\\/`
							)
						);
						if (allComments) {
							types_.push(allComments.join('\n'));
						}
					} else {
						if (extWithDot == '.ts') {
							import_.push(
								`import { ${baseName} } from './${join(
									folderPath,
									baseName
								).replace(/\\/g, '/')}';`
							);
						}
						if (extWithDot == '.mjs') {
							import_.push(
								`import { ${baseName} } from './${join(
									folderPath,
									baseName + extWithDot
								).replace(/\\/g, '/')}';`
							);
						}
						export_.push(baseName);
					}
				}
			}
			const tsCheckString = this.filePath.includes('.ts') ? '' : '// @ts-check\n\n';
			const types__ = types_.length ? '\n\n' + types_.join('\n') + '\n' : '';
			const fileString = `${tsCheckString}${this.comments}\n\n${import_.join(
				'\n'
			)}${types__}\nexport { ${export_.join(', ')} };`;
			LibDev.overwriteFileAsync(this.filePath, fileString);
		} catch (error) {
			console.error(`Error reading directory ${folderPath}:`, error);
		}
	};
	/**
	 * @private
	 * @param {string} filePath
	 * @param {string} content
	 */
	static overwriteFileAsync = async (filePath, content) => {
		try {
			await fs.writeFile(filePath, content, 'utf-8');
			console.log({ filePath, message: 'File Generated successfully.' });
		} catch (error) {
			console.error({ filePath, status: 'Error overwriting file:', error });
		}
	};
	/**
	 * @private
	 * @param {string} filePath
	 */
	static getBasenameWithoutExt(filePath) {
		const baseNameWithExt = basename(filePath);
		return baseNameWithExt.replace(extname(baseNameWithExt), '');
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
			const namedExportPattern = new RegExp(
				'export\\s+' + '(?:const|let|var|function|class|[^\\s]+)\\s+' + exportName + '\\b',
				'g'
			);
			if (namedExportPattern.test(code)) {
				return true;
			}
			return false;
		} catch (error) {
			console.error(`Error reading or parsing file ${path_}:`, error);
			return false;
		}
	};
}
