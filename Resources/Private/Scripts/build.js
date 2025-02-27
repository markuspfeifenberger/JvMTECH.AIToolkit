const esbuild = require("esbuild");
const extensibilityMap = require("@neos-project/neos-ui-extensibility/extensibilityMap.json");
const isWatch = process.argv.includes("--watch");

/** @type {import("esbuild").BuildOptions} */
const optionsTextFieldEditor = {
    logLevel: "info",
    bundle: true,
    target: "es2020",
    entryPoints: { Plugin: "TextFieldEditor/index.js" },
    loader: { ".js": "tsx" },
    outdir: "../../Public/TextFieldEditor",
    alias: extensibilityMap,
};

if (isWatch) {
    esbuild.context(optionsTextFieldEditor).then((ctx) => ctx.watch());
} else {
    esbuild.build(optionsTextFieldEditor);
}

/** @type {import("esbuild").BuildOptions} */
const optionsTextAreaEditor = {
    logLevel: "info",
    bundle: true,
    target: "es2020",
    entryPoints: { Plugin: "TextAreaEditor/index.js" },
    loader: { ".js": "tsx" },
    outdir: "../../Public/TextAreaEditor",
    alias: extensibilityMap,
};

if (isWatch) {
    esbuild.context(optionsTextAreaEditor).then((ctx) => ctx.watch());
} else {
    esbuild.build(optionsTextAreaEditor);
}
