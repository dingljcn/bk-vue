const path = require('path');

module.exports = {
    entry: './src/script/case-list/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.compile.min.js',
        path: path.resolve(__dirname, '../../src/script/case-list'),
    },
};