process.env.GENERATE_SOURCEMAP = true;
process.env.INLINE_RUNTIME_CHUNK = true;
process.env.NODE_ENV = 'DEVELOPMENT';

const factory = require('react-scripts/config/webpack.config')
const dev = factory("development")
const prod = factory("production")
const path = require("path")
require("../config/webpack.prod")(dev)
require("../config/webpack.prod")(prod)

dev.output = prod.output
dev.plugins.push(new (require("write-file-webpack-plugin")))
const copy = new (require("copy-webpack-plugin"))([{
    from: path.join(__dirname, "../public")
    , to: path.join(__dirname, "../build")
}], { ignore: ['*.html'] })
dev.plugins.push(copy)
dev.devtool = 'inline-source-map'

var rewire = require('rewire');
const mod = rewire("react-scripts/scripts/start.js")
mod.__set__("configFactory", () => dev)
