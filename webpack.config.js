const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSS = require('purifycss-webpack');
const glob = require('glob-all');

module.exports = {
    // 入口
    entry: { index: './src/index', vendor: ['react', 'react-dom'], },
    // 出口
    output: {
        path: path.resolve(__dirname, './dist'), // 生成dist文件夹
        filename: '[name].js' // 输出⽂件的名称: 多入口需要对应多入口filename的值需要改成： "[name].js",  [name]对应着key 占位符 bundle文件名称
    },
    //当前的构建环境
    mode: 'development',
    // 当webpack处理到不认识的模块时，需要在webpack中的module处进⾏配置，当检测到是什么格式的模块，使⽤什么loader来处理。
    module: {
        rules: [
            // 处理less文件
            {
                test: /\.less$/, //指定匹配规则
                include: path.resolve(__dirname, "./src"), // 去哪儿搜索匹配
                use: [{ // //指定使⽤的loader
                    loader: MiniCssExtractPlugin.loader, // 加载器
                    options: { // 配置项
                        publicPath: '../'
                    }
                }, 'css-loader', "postcss-loader", 'less-loader'],
            },
            { // 处理图片
                test: /\.(jpg|png|jpeg)$/,
                include: path.resolve(__dirname, "./src"),
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
            },
            { // 处理字体
                test: /\.(ttf|woff|woff2|svg)$/,
                include: path.resolve(__dirname, "./src"),
                use: {
                    loader: 'file-loader',
                    options: {
                        name: "[name]_[hash:4].[ext]",
                        outputPath: 'fonts/',
                    }
                }
            }, // 使用babel处理js/jsx文件
            {
                test: /\.(js|jsx)$/, // js或者jsx文件都可以
                include: path.resolve(__dirname, "./src"),
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
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
                removeEmptyAttributes: true, // 去掉空的属性
                removeTagWhitespace: true,
                removeStyleLinkTypeAttributes: true,
                minifyCSS: true // 压缩内联的css
            }
        }),
        // 单独生成css文件
        new MiniCssExtractPlugin({
            // contenthash： 只有自身内容修改了  打包时生成的名称才发生改变
            filename: "css/[name]_[contenthash:4].css",
            chunkFilename: "[id].css" // 或者css/[name].[contenthash:12].css
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
                path.resolve(__dirname, './src/*.html'), // 我们也需要对html⽂件进⾏清除
                path.resolve(__dirname, './src/*.js') // 对js⽂件进⾏清除
            ])
        })
    ],
    // 源代码与打包后的代码的映射关系
    devtool: 'cheap-source-map',
    // 自动打包和刷新页面
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'), // 默认会以根文件夹提供本地服务器，这里指定文件夹(指向静态资源目录)
        inline: true, // 自动刷新
        hot: true, // 开启热模块替换
        historyApiFallback: true, // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        open: true, // 服务启动之后，会自动帮我们打开浏览器窗口
        publicPath: '/',
        compress: true, // 使用gzip压缩
        stats: 'minimal',
        port: 8080, // 端口号，默认是8080
        proxy: { // 代理
            "/apis": {
                target: 'http://localhost:3001'
            }
        }
    },
    resolve: {
        // 设置别名
        alias: {
            "@": path.resolve(__dirname, "./src/"),
        },
        // 去哪些⽬录下去寻找第三⽅模块
        modules: [path.resolve(__dirname, "./node_modules")],
        // 后缀列表
        extensions: ['.js', '.json', '.ts', '.jsx']
    },
    optimization: {
        concatenateModules: true, // 开启Scope Hoisting
        usedExports: true, // 哪些导出的模块被使⽤了，再做打包
        // 代码分割
        splitChunks: {
            chunks: 'all',// async异步(默认) initial同步 all所有的模块有效
            minSize: 20000,//最⼩尺⼨，当模块⼤于20kb
            maxSize: 0,//对模块进⾏⼆次分割时使⽤，不推荐使⽤
            minChunks: 1,//打包⽣成的chunk⽂件最少有⼏个chunk引⽤了这个模块
            maxAsyncRequests: 30,//最⼤异步请求数，默认5
            maxInitialRequests: 30,//最⼤初始化请求数，默认3
            automaticNameDelimiter: '-',//打包分割符号
            name: true,//打包后的名称
            cacheGroups: {//缓存组
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "defaultVendors", // 要缓存的、分隔出来的chunk名称
                    priority: -10,//缓存组优先级 数字越⼤，优先级越⾼
                    reuseExistingChunk: true//是否重⽤该chunk
                },
                other: {
                    chunks: "initial", // initial| all | async(默认)
                    test: /react|lodash/, // 正则规则验证，如果符合就提取chunk,
                    name: "other",// 要缓存的、分隔出来的chunk名称
                    minSize: 20000,//最⼩尺⼨，当模块⼤于20kb
                    minChunks: 1,//打包⽣成的chunk⽂件最少有⼏个chunk引⽤了这个模块
                },
                default: {
                    minChunks: 2,//打包⽣成的chunk⽂件最少有⼏个chunk引⽤了这个模块
                    priority: -20,//缓存组优先级 数字越⼤，优先级越⾼
                    reuseExistingChunk: true//是否重⽤该chunk
                }
            }
        }
    }
}