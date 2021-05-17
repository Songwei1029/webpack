const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { merge } = require('webpack-merge'); // 最新版本的 需要这样来拿取merge函数
const commonConfig = require('./webpack.common.js');

const devConfig = {
    //当前的构建环境
    mode: 'development',
    // 当webpack处理到不认识的模块时，需要在webpack中的module处进⾏配置，当检测到是什么格式的模块，使⽤什么loader来处理。
    module: {
        rules: []
    },
    // 插件，是一种作用于webpack整个打包生命周期的机制
    plugins: [
        // 单独生成css文件
        new MiniCssExtractPlugin({
            // contenthash： 只有自身内容修改了  打包时生成的名称才发生改变
            filename: "css/[name]_[contenthash:4].css",
            chunkFilename: "[id].css"
        }),
        // 清除打包中的多余文件
        new CleanWebpackPlugin()
    ],
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
}

module.exports = merge(commonConfig, devConfig);