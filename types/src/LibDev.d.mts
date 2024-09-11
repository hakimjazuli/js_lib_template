export class LibDev {
    static generatedString: string[];
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
    private static hasNamedExport;
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
    constructor({ relativeFilePath, relativeFolderPath, copyright, description, chokidarWatchOptions, }: {
        relativeFilePath: string;
        relativeFolderPath?: string;
        copyright?: string[];
        description?: string[];
        chokidarWatchOptions?: import("chokidar").WatchOptions;
    });
    filePath: string;
    /**
     * @private
     */
    private comments;
    folderPath: string;
    /**
     * @private
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
