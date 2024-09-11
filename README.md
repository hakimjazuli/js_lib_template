# js_lib_template

-   allow `js/ts` dev to generate single file exporter

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
    > -   lowerCase at first letter will NOT be exported(on `generated file`);
    > -   it's highly unlikely you will run this library alone (without `tsc` or other script when
    >     developing a library)
    >     > -   so we took the liberty to put
    >     >     [`concurrently`](https://www.npmjs.com/package/concurrently) into our
    >     >     `peerDependency`
