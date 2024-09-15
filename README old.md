# js_lib_template

-   allow `mjs/ts` dev to generate single file exporter

## class API

-   `LibDev`

## install with

```shell
npm i @html_first/js_lib_template --save-dev
```

-   make sure it's on your `devDependencies` to avoid problems in production;

## the catch

-   opionanted
    > -   single-file<sup>1)</sup> single-named<sup>1)</sup> export
    >     > -   <sup>1)</sup>same name
    > -   lowerCase at first letter will NOT be exported(on `generated file`) unless, it has in the
    >     name;
    >     > -   `.type.`:
    >     >     > -   export first name matched `@typedef` comment inside the `file`;
    >     >     > -   it will export the whole comment, so if you don't want to export it, best to
    >     >     >     separate the comment block;
    >     > -   `.export.`:
    >     >     > -   export module with matched file name (without `.export.`);
    >     >     > -   usefull to export function like `html` literal (like on `lit`
    >     >     >     `html template literal function`);
    > -   it's highly unlikely you will run this library alone (without `tsc` or other script when
    >     developing a library)
    >     > -   so we took the liberty to put
    >     >     [`concurrently`](https://www.npmjs.com/package/concurrently) into our
    >     >     `peerDependency`
