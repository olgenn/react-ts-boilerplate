const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { publicPath, apiUrl, isDev, isProd, srcDir } = require('./env');

const env = {
    PUBLIC_URL: JSON.stringify(publicPath),
    API_URL: JSON.stringify(apiUrl),
};

const sourceMap = isDev;
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

module.exports = {
    resolve: {
        modules: ['node_modules', 'src', 'tests'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                oneOf: [
                    {
                        test: [/\.jsx?$/],
                        loader: 'babel-loader',
                        exclude: /node_modules/,
                    },
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader'
                    },
                    {
                        test: /\.svg$/,
                        use: [
                            {
                                loader: require.resolve('@svgr/webpack'),
                                options: {
                                    prettier: false,
                                    svgo: false,
                                    svgoConfig: {
                                        plugins: [{ removeViewBox: false }],
                                    },
                                    titleProp: true,
                                    ref: true,
                                },
                            },
                            {
                                loader: require.resolve('file-loader'),
                                options: {
                                    name: 'static/media/[name].[hash].[ext]',
                                },
                            },
                        ],
                        issuer: {
                            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
                        },
                    },
                    {
                        test: cssRegex,
                        exclude: cssModuleRegex,
                        use: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap,
                            modules: false,
                        }),
                    },
                    {
                        test: cssModuleRegex,
                        use: getStyleLoaders({
                            importLoaders: 1,
                            sourceMap,
                            modules: {
                                mode: 'local',
                                localIdentName: isDev ? "[local]--[hash:base64:5]" : "[hash:base64:5]",
                            },
                        }),
                    },
                    {
                        exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
                        type: 'asset/resource',
                    }
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html', inject: true }),

        new webpack.DefinePlugin({ 'process.env': env }),
    ],
    performance: {
        hints: false,
    },
};

function getStyleLoaders (cssOptions, preProcessor, preProcessorOptions) {
    let loaders = [
        isDev && 'style-loader',
        isProd && { loader: MiniCssExtractPlugin.loader },
        {
            loader: 'css-loader',
            options: cssOptions,
        },
        {

            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        ["postcss-preset-env", {
                            autoprefixer: { grid: true },
                            stage: 3,
                        }],
                    ],
                },

                sourceMap,
            },
        },
    ].filter(Boolean);

    if (preProcessor) {
        loaders.push(
            {
                loader: require.resolve('resolve-url-loader'),
                options: {
                    sourceMap,
                    root: srcDir,
                },
            },
            {
                loader: require.resolve(preProcessor),
                options: {
                    sourceMap,
                    ...(preProcessorOptions ?? {}),
                },
            }
        );
    }

    return loaders;
}
