/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path')
const webpack = require('webpack')
const config = require('../config')

// Remove this line once the following warning goes away (it was meant for webpack loader authors not users):
// 'DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic,
// see https://github.com/webpack/loader-utils/issues/56 parseQuery() will be replaced with getOptions()
// in the next major version of loader-utils.'
process.noDeprecation = true

module.exports = (options) => ({
  entry: options.entry,
  node: {
    dns: 'empty',
    module: 'empty',
    fs: 'empty',
    child_process: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), config.buildFolder),
    publicPath: config.publicPath
  }, options.output), // Merge with env dependent settings
  module: {
    noParse: /moment\.js/,
    rules: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery
        }
      },
      {
        test: /\.js$/, // Fix: Module parse failed: /app/node_modules/npm/bin/npm-cli.js Unexpected character '#' (1:0)
        include: /node_modules/,
        use: ['remove-hashbag-loader']
      },
      {
        // Preprocess for .scss files
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        // ex: sanitize.css
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|otf|ttf|woff|woff2)$/,
        // use: 'file-loader',
        use: 'url-loader?limit=1024&name=assets/fonts/[name].[ext]' // move font file to assets/fonts folder
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          // 'file-loader',
          // 'file-loader?name=images/[sha512:hash:base64:7].[ext]', // move image to images folder
          'url-loader?limit=1024&name=assets/images/[name].[ext]', // change background-image in scss file to base64 image, move image to assets/images folder
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      }
    ]
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch'
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.NamedModulesPlugin(),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    // new webpack.IgnorePlugin(/\.\/locale$/)
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    alias: {
      moment$: 'moment/moment.js',
    },
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
      '.scss'
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main'
    ]
  },
  resolveLoader: {
    alias: {
      'remove-hashbag-loader': path.join(__dirname, './loaders/remove-hashbag-loader')
    }
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    // fix Can't resolve 'jquery'
    "jquery": "jQuery"
  }
})
