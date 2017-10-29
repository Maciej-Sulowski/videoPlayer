const path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    autoprefixer = require('autoprefixer'),
    webpack = require('webpack');

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module:  {
        rules:  [
            { 
                test: /\.tsx?$/, 
                loader: 'awesome-typescript-loader'
            },
            { 
                enforce: 'pre', 
                test: /\.js$/, 
                loader: 'source-map-loader' },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader', 'postcss-loader']
                })
            }
        ]
    },
    devServer: {
        contentBase: __dirname,
        compress: true,
        inline: true,
        stats: "errors-only",
        open: true
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'styles.min.css',
            disable: false,
            allChunks: true
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer]
            }
        })
    ],
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};
