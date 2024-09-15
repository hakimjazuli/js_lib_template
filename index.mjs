// @ts-check

/**
 * generated using:
 * @see {@link https://www.npmjs.com/package/@html_first/js_lib_template | @html_first/js_lib_template}
 * @copyright
 * developed and published under MIT license,
 * @description
 * !!!Note generated using [@html_first/js_lib_template](https://www.npmjs.com/package/@html_firstjs_lib_template)
 * 
 * !!!WARNING STARTS this library is highly opionated
 * - uses single-named export on same-named file
 * - will not check nested file inside a sub-folders
 * - don't use it on a production or published library directly without checking any of it's behaviour
 * that might not suited to your library paradigm;
 * - it also directly messes with `filePath`
 * >	- generate single exporter at `filePath`
 * - and `readMePath`
 * >	- generate single `mark down` file
 * - so again unless you are familiar with this library output, don't run it on prod or published
 * 
 * !!!WARNING ENDS
 * 
 * ## HOW TO INSTALL
 * ```shell
 * npm i @html_firstjs_lib_template --save-dev
 * ```
 * or
 * ```shell
 * bun i @html_firstjs_lib_template -D
 * ```
 * or any other library management cli
 * ## HOW TO USE
 *  create new `LibDev` instance
 *  ```js
 * /// file.mjs
 * /// @ts-check
 * 
 * import { LibDev } from "@html_first/js_lib_template"
 * 
 * new LibDev(options);
 * ```
 * 
 * ```js
 * node ./path/to/file.mjs /// ofcourse you can other than node, like bun deno or other
 * ```
 */

import { LibDev } from './src/LibDev.mjs';
export { LibDev };