const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
process.env.GENERATE_SOURCEMAP = false;
process.env.INLINE_RUNTIME_CHUNK = false;

const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];

const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension =>
        fs.existsSync(resolveFn(`${filePath}.${extension}`))
    );

    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }

    return resolveFn(`${filePath}.js`);
};
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = function (config) {
    config.entry = {
        app: resolveModule(resolveApp, 'src/index'),
        compare: resolveModule(resolveApp, 'src/compare'),
        contentscript: [
            resolveModule(resolveApp, 'src/contentscript')
        ],
        backgroundscript: [
            resolveModule(resolveApp, 'src/backgroundscript')
        ],
    }


    config.plugins.push(
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ["app"],
            template: resolveApp('public/index.html'),
            filename: 'app.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ["compare"],
            template: resolveApp('public/index.html'),
            filename: 'compare.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
    )

    config.plugins.forEach(element => {
        if (element instanceof MiniCssExtractPlugin) {
            element.options.filename= 'static/css/[name].css';
            element.options.chunkFilename= 'static/css/[name].chunk.css';
        }
    });
    config.output.filename = 'static/js/[name].js';
    config.output.chunkFilename = 'static/js/[name].chunk.js';
    config.optimization.runtimeChunk = false;
    config.optimization.splitChunks = undefined;
}