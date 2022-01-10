const {join} = require('path');

const mode = process.env.NODE_ENV || 'production';
const isProd = mode === 'production';
const isDev = !isProd;
const rootDir = join(__dirname, '../');
const srcDir = join(__dirname, '../src');
const webpackDir = join(__dirname, './');
const buildDir = join(__dirname, '../build');
const apiUrl = process.env.API_URL || "/api";

module.exports = {
    isProd,
    isDev,
    rootDir,
    webpackDir,
    srcDir,
    buildDir,
    apiUrl,
}
