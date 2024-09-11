# js_lib_template

-   allow `js/ts` dev to generate single file exporter

## class API

-   `LibDev`

## the catch

-   opionanted
    > -   single-file<sup>1)</sup> single-named<sup>1)</sup> export
    >     > -   <sup>1)</sup>same name
    > -   only uppercase at first letter will be exported;
    > -   it's highly unlikely you will run this library alone (without `tsc` or other script when
    >     developing a library)
    >     > -   so we took the liberty to put
    >     >     [`concurrently`](https://www.npmjs.com/package/concurrently) into our
    >     >     `peerDependency`
