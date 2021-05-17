const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    // 入口
    entry: { index: './src/index' }, // 需要是./
    // 出口
    output: {
        path: path.resolve(__dirname, '../dist'), // 生成dist文件夹
        filename: '[name].js' // 输出⽂件的名称: 多入口需要对应多入口filename的值需要改成： "[name].js",  [name]对应着key 占位符 bundle文件名称
    },
    // 当webpack处理到不认识的模块时，需要在webpack中的module处进⾏配置，当检测到是什么格式的模块，使⽤什么loader来处理。
    module: {
        rules: [
            {
                test: /\.less$/, //指定匹配规则
                include: path.resolve(__dirname, "../src"), // 去哪儿搜索匹配
                use: [{ // //指定使⽤的loader
                    loader: MiniCssExtractPlugin.loader,
                    options: { // 配置项
                        publicPath: '../'
                    }
                }, 'css-loader', "postcss-loader", 'less-loader'],
            },
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
                ]
            },
            {
                test: /\.(ttf|woff|woff2|svg)$/,
                include: path.resolve(__dirname, "../src"),
                use: {
                    loader: 'file-loader',
                    options: {
                        name: "[name]_[hash:4].[ext]",
                        outputPath: 'fonts/',
                    }
                }
            },
            {
                test: /\.(js|jsx)$/, // js或者jsx文件都可以
                include: path.resolve(__dirname, "../src"),
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
            template: './src/index.html', // 模板：  需要是./
            filename: 'index.html',  // 生成的html名字
        }),
        // 单独生成css文件
        new MiniCssExtractPlugin({
            // contenthash： 只有自身内容修改了  打包时生成的名称才发生改变
            filename: "css/[name]_[contenthash:4].css",
            chunkFilename: "[id].css"
        }),
        // 清除打包中的多余文件
        new CleanWebpackPlugin(),
    ],
    // 源代码与打包后的代码的映射关系
    devtool: 'cheap-source-map',
    resolve: {
        // 设置别名
        alias: {
            "@": path.resolve(__dirname, "../src/"),
        },
        // 去哪些⽬录下去寻找第三⽅模块
        modules: [path.resolve(__dirname, "../node_modules")],
        // 后缀列表
        extensions: ['.js', '.json', '.ts', '.jsx']
    },
}