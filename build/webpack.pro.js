const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');
const { merge } = require('webpack-merge'); // 最新版本的 需要这样来拿取merge函数
const commonConfig = require('./webpack.common.js');

const proConfig = {
    //当前的构建环境
    mode: 'production',
    // 当webpack处理到不认识的模块时，需要在webpack中的module处进⾏配置，当检测到是什么格式的模块，使⽤什么loader来处理。
    module: {
        rules: [
            {
                test: /\.(jpg|png|jpeg)$/,
                include: path.resolve(__dirname, "../src"),
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: "[name]_[hash:4].[ext]",
                            outputPath: 'imgs/',
                            limit: 20480, // ⼩于20480，才转换成base64，可以帮助我们处理小体积的图片，减少http请求,然后放入bundleJs文件中
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    },
                ]
            }
        ]
    },
    // 插件，是一种作用于webpack整个打包生命周期的机制
    plugins: [
        // 打包结束后，⾃动⽣成⼀个html⽂件，并把打包⽣成的js模块引⼊到该html中
        new HtmlWebpackPlugin({
            template: './src/index.html', // 模板
            filename: 'index.html',  // 生成的html名字
            chunks: ['index'],// 加载哪些js
            minify: { // 压缩
                removeComments: true, // 去掉注释
                collapseWhitespace: true, // 删除换⾏符与空⽩符
                minifyCSS: true // 压缩内联的css
            }
        }),

        // 清除打包中的多余文件
        new CleanWebpackPlugin(),
        // 压缩css文件
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g, // 此插件压缩的对象是由mini-css-extract-plugin插件输出的css文件,而不是css源文件
            cssProcessor: require("cssnano"), // 压缩css的处理器,返回promise对象
            cssProcessorOptions: { // 传递给cssProcessor的配置对象
                // 移除所有的空格和引号
                discardComments: { removeAll: true }
            },
            canPrint: true // 配置插件是否可以将消息打印到控制台
        }),
        // 清除⽆⽤ css
        new PurifyCSS({
            paths: glob.sync([
                // 匹配要清除的路径⽂件
                path.resolve(__dirname, '../src/*.html'), // 我们也需要对html⽂件进⾏清除
                path.resolve(__dirname, '../src/*.js') // 对js⽂件进⾏清除
            ])
        })
    ],
    optimization: {
        concatenateModules: true, // 开启Scope Hoisting
        usedExports: true, // 哪些导出的模块被使⽤了，再做打包
        // 代码分割
        splitChunks: {
            chunks: "all"
        }
    }
}

module.exports = merge(commonConfig, proConfig);