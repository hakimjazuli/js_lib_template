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
    /**
     * @type {core}
     */
    static __: core;
    /**
     * @param {coreOptions} options
     */
    constructor({ filePath, readMePath, folderPath, tableOfContentTitle, copyright, description, option, }: coreOptions);
    queueHandler: _Queue;
    exportedListContentTitle: string;
    /**
     * @type {string}
     */
    goToExportedList: string;
    /**
     * @type {string}
     */
    filePath: string;
    readmeOpening: string[];
    /**
     * @type {string[]}
     */
    moduleReadme: string[];
    /**
     * @protected
     * @type {string}
     */
    protected commentBlockOnExportedModule: string;
    /**
     * @type {string}
     */
    folderPath: string;
    /**
     * @type {import('chokidar').FSWatcher}
     */
    watcher: import("chokidar").FSWatcher;
    /**
     * @type {string}
     */
    readMePath: string;
    /**
     * @private
     * @type {RegExp}
     */
    private getFirstDescriptionBlockRegex;
    /**
     * @readonly
     */
    readonly generatedString: string[];
    /**
     * @readonly
     */
    readonly directives: {
        typeDirective: string;
        exportDirective: string;
    };
    /**
     * @param {Extract<keyof core["directives"], string>} directiveName
     * @returns {string}
     */
    makeDirective: (directiveName: Extract<keyof core["directives"], string>) => string;
    /**
     * @param {string[]} extentionsWithDot
     * @returns {Promise<(Awaited<ReturnType<core["getFileDetails"]>>)[]>}
     */
    getListFilesNestedDetails: (extentionsWithDot: string[]) => Promise<(Awaited<ReturnType<core["getFileDetails"]>>)[]>;
    /**
     * @param {string} relativeFilePath
     * -
     */
    getContent: (relativeFilePath: string) => string;
    /**
     * @protected
     * @param {Dirent} dirent
     */
    protected getFileDetails: (dirent: Dirent) => Promise<{
        parentPath: string;
        name: string;
        /**
         * @param {Extract<keyof core["directives"], string>} searchString
         */
        containtDirective: (searchString: Extract<keyof core["directives"], string>) => boolean;
        fileContent: string;
        ext: string;
        filePath: string;
        namedExport: {
            exportName: string;
            forReadMeLink: string;
            hasNamedExport: boolean;
            isValidExportName: boolean;
        };
    }>;
    /**
     * @private
     * @param {string} filePath
     * @param {string} fileContent
     * @return {Promise<{exportName:string, forReadMeLink:string, hasNamedExport:boolean, isValidExportName:boolean}>}
     */
    private hasNamedExport;
    /**
     * @param {string} currentPath
     * @param {string[]} extentionsWithDot
     * @param {import('fs').Dirent[]} result
     * @returns {Promise<import('fs').Dirent[]>}
     */
    walkSync: (currentPath: string, extentionsWithDot: string[], result?: import("fs").Dirent[]) => Promise<import("fs").Dirent[]>;
    /**
     * @param {string} filePath
     * @param {string} content
     */
    overwriteFile: (filePath: string, content: string) => void;
    /**
     * @private
     * @param {string} fileContent
     * @param {string} descString
     * @returns {string}
     */
    private getFirstDescriptionBlockUnsanitized;
    /**
     * @private
     * @param {string} parentPath
     * @param {string} commentString
     */
    private resolveCommentImport;
    /**
     * @param {Object} options
     * @param {string} options.fileContent
     * @param {string} [options.asReadMeExportedName]
     * @returns {string}
     */
    getFirstDescriptionBlock: ({ fileContent, asReadMeExportedName }: {
        fileContent: string;
        asReadMeExportedName?: string;
    }) => string;
    /**
     * @param {string} filePath
     */
    getBasenameWithoutExt(filePath: string): string;
    /**
     * @param {string[]} lines
     */
    generateCommentBlock(lines: string[]): string;
    /**
     * @type {string}
     */
    typeDirective: string;
    /**
     * @type {string}
     */
    exportDirective: string;
    /**
     * @private
     * @param {() => Promise<void>} processFiles
     */
    private handler;
    run: () => Promise<void>;
    /**
     * @protected
     * @param {string} parentPath
     * @param {string} fileContent
     * @param {string} exportName
     * @returns {RegExpMatchArray|null}
     */
    protected getTypeDefsOnDirectiveFile: (parentPath: string, fileContent: string, exportName: string) => RegExpMatchArray | null;
    /**
     * @param {string} exportName
     * @returns {string[]}
     */
    _exportPatterns: (exportName: string) => string[];
    processFiles: () => Promise<void>;
    /**
     * @protected
     * @return {Promise<void>}
     */
    protected _processFiles: () => Promise<void>;
    /**
     * @type {string}
     */
    _typedefIdentifier: string;
    /**
     * @type {string}
     */
    _descriptionKeyword: string;
}
/**
 * *
 */
export type coreOptions = {
    /**
     * * - realtive path from wroking directory
     * *
     */
    filePath?: string;
    /**
     * * - realtive path from wroking directory
     * *
     */
    folderPath?: string;
    /**
     * *
     */
    folderPathAlias?: string;
    /**
     * * - realtive path from wroking directory
     * *
     */
    readMePath?: string;
    /**
     * *
     */
    tableOfContentTitle?: string;
    /**
     * *
     */
    typedef?: string[];
    /**
     * *
     */
    copyright?: string[];
    /**
     * *
     */
    description?: string[];
    /**
     * *[blank]/
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
    option?: import("chokidar").WatchOptions;
};
import { _Queue } from '@html_first/simple_queue';
import { Dirent } from 'fs';
