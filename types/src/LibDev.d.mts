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
    private static readonly generatedString;
    /**
     * @private
     */
    private static directives;
    /**
     * @private
     * @param {Extract<keyof LibDev.directives, string>} directiveName
     * @returns {string}
     */
    private static makeDirective;
    /**
     * @private
     * @param {string[]} lines
     */
    private static generateCommentBlock;
    static exportedListContent: string;
    /**
     * @private
     * @param {string} fileString
     * @returns {string}
     */
    private static getFirstDescriptionBlock;
    /**
     * @private
     */
    private static goToExportedList;
    /**
     * @private
     * @param {string} fileString
     * @param {string} [fileName]
     * @returns {string}
     */
    private static readMeString;
    /**
     * @private
     * @param {string} filePath
     * @param {string} content
     */
    private static overwriteFileAsync;
    /**
     * @private
     * @param {string} filePath
     */
    private static getBasenameWithoutExt;
    /**
     * @private
     * @param {string} path_
     */
    private static getContent;
    /**
     * @private
     * @param {string} path_
     */
    private static hasNamedExport;
    /**
     * @param {Object} a0
     * @param {string} a0.filePath
     * - realtive path
     * @param {string} [a0.folderPath]
     * - realtive path
     * @param {string} [a0.readMePath]
     * - realtive path
     * @param {string[]} [a0.copyright]
     * @param {string[]} [a0.description]
     * @param {import('chokidar').WatchOptions} [a0.option]
     */
    constructor({ filePath, readMePath, folderPath, copyright, description, option, }: {
        filePath: string;
        folderPath?: string;
        readMePath?: string;
        copyright?: string[];
        description?: string[];
        option?: import("chokidar").WatchOptions;
    });
    /**
     * @private
     * @type {string}
     */
    private filePath;
    /**
     * @private
     * @type {string}
     */
    private comment;
    /**
     * @private
     * @type {string}
     */
    private folderPath;
    /**
     * @private
     * @type {chokidar.FSWatcher}
     */
    private watcher;
    /**
     * @private
     * @type {_Queue}
     */
    private queueHandler;
    /**
     * @private
     * @type {string}
     */
    private readMePath;
    /**
     * @private
     */
    private createHandler;
    /**
     * @private
     * @param {string} path_
     */
    private handle;
    /**
     * @private
     */
    private listFilesInFolder;
}
