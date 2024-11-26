## HOW TO INSTALL

```shell

npm i @html_first/js_lib_template --save-dev

```

or

```shell

bun i @html_first/js_lib_template -D

```

or any npm dependency management cli

## singleton_instantiate_to_run

- class prefixed with "__", are:

> - `singleton`, can only be instantiated once;

> - call `run` method of the instance, to starts the watcher to autogenerate the documentation;

## exported-api-and-type-list

- [__JSDev](#__jsdev)

- [__PHPDev](#__phpdev)

- [core](#core)

<h2 id="__jsdev">__JSDev</h2>

- `extended` from [core](#core)- [singleton_instantiate_to_run](#singleton_instantiate_to_run);- `fileName` contains `.type.` detects `@`+`typedef` + ... + `fileName`;- supports nested folders;- targets [`'*.mjs'`, `'*.ts'`, `'*.mts'`] `files`;- `instantiate` class API to watch for file changes;- the exported API should contains match literally:```js/** * @param {string} exportName * @returns {string[]} */exportPatterns = (exportName) => [	`export class ${exportName}`,	`export const ${exportName}`,	`export function ${exportName}`,];```- doesn't support `var` or `let`, for semantics;- supports for [`"*.mjs"`, `"*.ts",` `"*.mts"`];- `fileName` contains `.type.` detects `@`+`typedef` + ... +  `fileName`;- additional base setup for js developement:> - generate `types`;```js// tsconfig.js{"compilerOptions": {	"allowJs": true,	"declaration": true,	"emitDeclarationOnly": true,	"outDir": "./types",	"module": "ESNext",	"target": "ES2020",	"moduleResolution": "node",	"esModuleInterop": true,	"skipLibCheck": true,	"baseUrl": "."},"include": [filePathOptionValue]}```> - generation script```js// package.json{..."main": "index.mjs","types": "./types/index.d.mts","module": "index.mjs","type": "module",..."scripts": {	"dev": "concurrently \"bun --watch ./dev/index.mjs\" \"bun tsc --watch\""},...}```- with type definition it can also check for:> - if there are any name colision, as we don't support aliases exports;> - allow your library user to set `skiplibChecks: false` on their `typescript` configuration;

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="__phpdev">__PHPDev</h2>

- `extended` from [core](#core)- [singleton_instantiate_to_run](#singleton_instantiate_to_run);- `fileName` contains `.type.` detects `@`+`see` + ... + `fileName`;- using class instantiation, generate single `markdown` documentation for `PHP`;> - on comment after `@see` throught the end of comment will be added;- supports nesting;- additional base setup;- example file setting:```js// ./dev/index.mjs// @ts-checkimport { __PHPDev } from '@html_first/js_lib_template';new __PHPDev({ folderPath: './src', readMePath: './README.md',  description: ['## HOW TO INSTALL','```shell,'composer require author/package-name',```'].}).run();```- saving script for convenience:```js// package.json{..."scripts": {...	"dev": "concurrently \"bun --watch ./dev/index.mjs\" \"bun tsc --watch\""...},}...```- starts watching:```shellbun dev// ornpm run dev```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="core">core</h2>

- class template for `auto document/export generator`;> - extended class must call super on it's constructor```jsexport class MyClass extends {	constructor(){ 		super({ ...coreOptions });		// ...	}	// ...	// also you need to override any method and property prefixed with "_"}```- constructor argument:```js/** * @typedef {Object} coreOptions * @property {string} [coreOptions.filePath] * - realtive path from wroking directory * @property {string} [coreOptions.folderPath] * - realtive path from wroking directory * @property {string} [coreOptions.readMePath] * - realtive path from wroking directory * @property {string} [coreOptions.tableOfContentTitle] * @property {string[]} [coreOptions.copyright] * @property {string[]} [coreOptions.description] * @property {import('chokidar').WatchOptions} [coreOptions.option] */```-  we use chokidar for watching changes:> - refer the options to [chokidar github](https://github.com/paulmillr/chokidar)- in essence this class is a collection of method to help to do the above points, incase of you want to create your own `documentation/export generator` calling `this.createHandler`;- file content detection uses `string.includes`, as I cannot get arround `regex` to allow me to use `$` as export name;- `README.md` auto export rules:> - has `description`;> - in case you want to render empty string use [`blank`];> - detectes the first `commentBlock` with `description`;> - automatically turns string after last `description` of that `commentBlock` until end of the `commentBlock`;> - `upperCase` OR `symbol`;> - `fileName` match with `exportedName`;> - `special export`:> - `fileName` contains `.type.`:> > only works on `language` that have `type` supports, where `declaring` and `assigning` `types` can be done on different `file`:> > - will detect depends on the `handler` `@`+`coreInstance._typedefIdentifier` ... + `filename`;> - `fileName` contains `.export.`:> > - use to bypass `upperCase` rule:- links:> - auto named `h2` tag `id`, it match the `fileName` in `lowerCase`;> - in this `autoExported` case `__JSDev` can be refered as `#__jsdev`;> - use `namedExport` extracted files from `this.getListFilesNestedDetails` method;> - run `thisInstance.run();` to start the watcher;!!!WARNING- copy out:> - filePath: default `./index.mjs`,> - readMePath: default `./README.md`,> - folderPath: default `./src/*`,> - `typescript` `outDir` or `package.json` `types`: default `./types/*`,- of any file you might need to be unmodified, before fully knowing what this library will modify...

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>
