# Chapter01/Module-frontend

This section shows several examples on how to import the D3 library using frontend JavaScript or HTML. Although using individual modules is recommended, we will import the full D3 bundle in most examples in this book.

## 2) Description of each file in this folder

__`modules`__

JavaScript files used in the examples. They are imported in the HTML files using relative URLs.

__`1-legacy-cdn.html`__

Loads D3 library from a CDN using the `&lt;script>` tag. The `type="module"` attribute allows modern browsers to defer loading the script after rendering the page. Older browsers will ignore this.

__`2-legacy-local.html`__

Loads D3 library from a local file using the `&lt;script> tag`. The `type="module"` attribute allows modern browsers to defer loading the script after rendering the page. Older browsers will ignore this.

__`3-import-esm-cdn.html`__

Imports the D3 library as an ES module stored in a CDN. Only works in modern browsers.

__`4-import-esm-local.html`__
 
Imports the D3 library as an ES module stored locally. Only works in modern browsers.

__`5-import-esm-modules.html`__

Imports multiple ES modules. One is transitive but must be imported because a function from it is used.

__`6-import-esm-modules-prefix.html`__

If you want to use the same `d3` prefix to call functions from multiple modules, you can import them using `Promise.all()` and assign the prefix to both.

__`7-import-esm-external-script.html`__

Typical Web applications keep most of the JavaScript in external files. This example shows how to import a local external script as an ES module and start the app from the HTML file.

__`8-import-esm-external-script-full.html`__

You can keep all the code in external scripts. This example imports an external script that runs the app.

__`9-import-esm-modules-no-prefix`__

You can use individual functions from different modules without a prefix, or assign different prefixes to them.

__`10-legacy-cdn-modules.html`__

If you want to import separate modules without using ESM, you also need to import all the transitive dependencies.

__`11-import-transitive-test.html`__

Transitive dependencies (`d3-transition`, in this case) don't need to be imported (unless you need to call a function from it).

__`12-import-transitive-test-legacy.html`__

In non-ESM code, it's simpler to import the default bundle, to avoid too many script imports in HTML.

See also examples in `Appendix/` for importing modules using a Node.js environment (npm).
