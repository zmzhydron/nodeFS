const webpack = require('webpack');
const path = require("path")
//添加有公用引用文件，集中引用打包。
const vendors = [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'redux',
    'redux-thunk'
];
module.exports = {
    output: {
        //把公共库集中打包后存放的地址
        path: path.resolve(__dirname,"./client/vendors"),
        //打包文件名称
        filename: 'vendors.js',
        //
        library: 'vendors',
    },
    entry: {
        //打包的公共文件
        "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            //这里的manifest.json是在webpack最后打包时候用到的
            //里面包含了系列的node_modules地址，这些地址就是在NPM包里引用vendors里库的地址
            //用于最后替换成打包后的vendors.js
            path: 'manifest.json',
            name: 'vendors',
            //这里的context和webpack.config.js里 new webpack.DllReferencePlugin的context要保持一致
            //因为webpack.config.js需要引用manifest.json文件，如果路径错误，那么就可能替换错误
            context: __dirname,
        }),
    ],
};