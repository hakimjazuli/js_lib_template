export class LibDev {
    /**
     * @private
     * @readonly
     */
    private static readonly generatedString;
    /**
     * @private
     * @readonly
     */
    private static readonly typesIdentifier;
    /**
     * @private
     * @param {string[]} lines
     */
    private static generateCommentBlock;
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
     * @param {string[]} [a0.copyright]
     * @param {string[]} [a0.description]
     * @param {import('chokidar').WatchOptions} [a0.option]
     */
    constructor({ filePath, folderPath, copyright, description, option }: {
        filePath: string;
        folderPath?: string;
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
    private comments;
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
