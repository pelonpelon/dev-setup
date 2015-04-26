'use strict';

var webpack = require('webpack');
var config = require('./myprivateconfig.js');
var path = require('path');

module.exports = {
    progress: true,
    colors: true,
    devtool: 'eval',

    context: __dirname + '/src',
    entry: './app.coffee',

    output: {
      path: __dirname + '/build/' + config.version,
      filename: '[hash].bundle.js',
      publicPath: config.version + '/'
    },

    stats: {
      colors: true,
      reasons: true
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': 'production'
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
      // new ExtractTextPlugin('styles.css')
    ],

    resolve: {
      modulesDirectories: [
        'node_modules',
        'bower_components'
      ],
      alias: {
      },
      extensions: ['', '.web.coffee', '.webpack.coffee', '.coffee', '.webpack.js', '.web.js', '.js', '.es6.js', '.msx']
    },

    module: {
      preLoaders: [
        {
          test: /\.js$/,
          include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'test')
              ],
          loader: 'jshint'
        }
      ],

      loaders: [
        {
          test: /\.es6\.js$/,
          include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'test')
              ],
          loader: 'babel-loader'
        },
        {
          test: /\.coffee$/,
          include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'test')
              ],
          loader: 'coffee'
        },
        {
          test: /\.styl/,
          include: [
                path.resolve(__dirname, 'src/styles')
              ],
          loader: 'style!css?sourceMap!stylus?sourcemap=true&resolve-url=true'
        },
        {
          test: /\.gif/,
          include: [
                path.resolve(__dirname, 'src/assets')
              ],
          loader: 'url-loader?limit=10000&mimetype=image/gif'
        },
        {
          test: /\.jpg/,
          include: [
                path.resolve(__dirname, 'src/assets')
              ],
          loader: 'url-loader?limit=10000&mimetype=image/jpg'
        },
        {
          test: /\.png/,
          include: [
                path.resolve(__dirname, 'src/assets')
              ],
          loader: 'url-loader?limit=10000&mimetype=image/png'
        }
        // {
          // test: /\.msx$/,
          // include: [
                // path.resolve(__dirname, 'src'),
                // path.resolve(__dirname, 'test')
              // ],
          // loader: 'sweetjs?modules[]=msx-reader/macros/msx-macro,readers[]=msx-reader'
        // },
        // {
          // test: /\.css$/,
          // include: [
                // path.resolve(__dirname, 'src/styles')
              // ],
          // loader: 'style!css'
        // },
        // {
          // test: /\.less$/,
          // include: [
                // path.resolve(__dirname, 'src/styles')
              // ],
          // loader: 'style!css!less'
        // },
        // {
          // test: /\.(otf|eot|png|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          // loader: 'file-loader'
        // },
        // {
          // test: /\.svg$/,
          // test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          // loader: 'url-loader?limit=10000&minetype=application/font-woff'
          // loader: 'file-loader'
        // },
        // {test: /\.woff($|\?)/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
        // { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
        // { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      ]
    },

    // more options in the optional jshint object
    // see: http://jshint.com/docs/ for more details
    jshint: {

      // node keywords and variables (ie. console.log, use strict
      node: true,

      // suppress semicolon warnings
      asi: true,

      // This option prohibits the use of a variable before it was defined.
      // JavaScript has function scope only and, in addition to that,
      // all variables are always moved—or hoisted— to the top of the function.
      // This behavior can lead to some very nasty bugs and that's why it is safer
      // to always use variable only after they have been explicitly defined.
      // Setting this option to 'nofunc' will allow function declarations to be ignored.
      latedef: 'nofunc',

      // any jshint option http://www.jshint.com/docs/options/
      // i. e.
      camelcase: true,

      // any globals that should be suppressed
      globals: ['m'],

      // jshint errors are displayed by default as warnings
      // set emitErrors to true to display them as errors
      emitErrors: false,

      // jshint to not interrupt the compilation
      // if you want any file with jshint errors to fail
      // set failOnHint to true
      failOnHint: false,

      // custom reporter function
      reporter: require('./jshintReporter.js')
    }
  };
