// @ts-check

/**
 * generated using:
 * @see {@link https://www.npmjs.com/package/@html_first/js_lib_template | @html_first/js_lib_template}
 * @copyright:
 * developed and published under MIT license,
 * ;;;
 * @description:
 * -   `.type.`:
 *   > -   export first name matched `typedef` comment inside the `file`;
 *   > -   it will export the whole comment, so if you don't want to export it, best to
 *   >     separate the comment block;
 * -   `.export.`:
 *   > -   export module with matched file name (without `.export.`);
 *   > -   usefull to export function like `html` literal (like on `lit`
 *   >     `html template literal function`);
 * !!!WARNING!!!
 * - this library uses single-named export on same-named file
 * - don't use it on a production or published library directly without checking any behaviour
 * that might not suited to your library paradigm;
 * - it also directly messes with `relativeFilePath`
 * >	- generate single exporter
 * - and `relativeFolderPath`
 * >	- generate `.d.ts` OR `.d.mts`
 * - so again unless you are familiar with this library output, don't run it on prod or published
 * !!!WARNING!!!
 * ;;;
 */

import { LibDev } from './src/LibDev.mjs';
export { LibDev };
