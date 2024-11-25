## HOW TO INSTALL

```shell

npm i @html_firstjs_lib_template --save-dev

```

or

```shell

bun i @html_firstjs_lib_template -D

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

- `extended` from [core](#core)- [singleton_instantiate_to_run](#singleton_instantiate_to_run);- `fileName` contains `.type.` detects `@`+`typedef` + ... + `fileName`;- supports nested folders;- targets [`'*.mjs'`, `'*.ts'`, `'*.mts'`] `files`;- `instantiate` class API to watch for file changes;- the exported API should contains match literally:```js/** * @param {string} exportName * @returns {string[]} *

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="__phpdev">__PHPDev</h2>

- `extended` from [core](#core)- [singleton_instantiate_to_run](#singleton_instantiate_to_run);- `fileName` contains `.type.` detects `@`+`see` + ... + `fileName`;- using class instantiation, generate single `markdown` documentation for `PHP`;> - on comment after `@see` throught the end of comment will be added;- supports nesting;- additional base setup;- example file setting:```js// ./dev/index.mjs// @ts-checkimport { __PHPDev } from '@html_first/js_lib_template';new __PHPDev({ folderPath: './src', readMePath: './README.md',  description: ['## HOW TO INSTALL','```shell,'composer require author/package-name',```'].}).run();```- saving script for convenience:```js// package.json{..."scripts": {...	"dev": "concurrently \"bun --watch ./dev/index.mjs\" \"bun tsc --watch\""...},}...```- starts watching:```shellbun dev// ornpm run dev```

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>


<h2 id="core">core</h2>

- class template for `auto document/export generator`;> - extended class must call super on it's constructor```jsexport class MyClass extends {	constructor(){ 		super({ ...coreOptions });		// ...	}	// ...	// also you need to override any method and property prefixed with "_"}```- constructor argument:```js/** * @typedef {Object} coreOptions * @property {string} [coreOptions.filePath] * - realtive path from wroking directory * @property {string} [coreOptions.folderPath] * - realtive path from wroking directory * @property {string} [coreOptions.folderPathAlias] * @property {string} [coreOptions.readMePath] * - realtive path from wroking directory * @property {string} [coreOptions.tableOfContentTitle] * @property {string[]} [coreOptions.typedef] * @property {string[]} [coreOptions.copyright] * @property {string[]} [coreOptions.description] * @property {import('chokidar').WatchOptions} [coreOptions.option] *

*) <sub>[go to exported list](#exported-api-and-type-list)</sub>
