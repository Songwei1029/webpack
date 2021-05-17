module.exports = {
    //postcs就是处理css成AST抽象语法树
    //如何把这个AST抽象语法树转换成相应的css =>  postcss插件机制
    plugins: [
      require("autoprefixer")({
        overrideBrowserslist: ["last 3 versions", ">2%"], 
        // 配置参数 降低浏览器的标准，因为浏览器很多属性已经支持了
        // browserslist: package.json中的一个配置字段，浏览器的类型，告诉项目是兼容到哪些浏览器的
        // overrideBrowserslist： override是重写、覆盖的意思，这样它的优先级就比browserslist高
        // ["last 3 versions", ">2%"]：是 last 2 versions是兼容到浏览器的最后（最新）三个版本，>2%是浏览器在市面上的占有率大于2%的都要兼容到
      }),
    ],
};