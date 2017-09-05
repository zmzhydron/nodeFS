const webpack = require('webpack');
const path = require("path")
const vendors = [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'redux',
    'redux-thunk'
    // ...其它库
];
module.exports = {
    output: {
        path: path.resolve(__dirname,"./client/vendors"),
        filename: 'vendors.js',
        library: 'vendors',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: 'vendors',
            context: __dirname,
        }),
    ],
};