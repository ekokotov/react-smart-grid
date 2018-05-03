const path = require('path'),
  process = require('process'),
  webpack = require('webpack'),
  isPROD = process.env.NODE_ENV === 'production',
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
  uglifyjs = require('uglifyjs-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

if (isPROD) console.warn("### You are using PRODUCTION mode ###");

const PATH = {
  ENTRY: path.resolve(__dirname, 'app.jsx'),
  TMP: path.resolve(__dirname, '.tmp'),
  BABEL_CACHE: path.resolve(__dirname, '.tmp/.cache')
};

const BASE_CONFIG = {
  mode: isPROD ? 'production' : 'development',
  entry: PATH.ENTRY,
  output: {
    path: PATH.TMP,
    filename: './[name]/react.[name].bundle.js'
  },
  plugins: [new ExtractTextPlugin('./style.css')],
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: PATH.BABEL_CACHE
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        // options: {
        //   data: "$env: " + process.env.NODE_ENV + ";"
        // },
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              minimize: true,
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

const PROD_CONFIG = {
  plugins: [
    new uglifyjs({
      parallel: 4,
      uglifyOptions: {
        unused: true,
        dead_code: true, // big one--strip code that will never execute
        warnings: false, // good for prod apps so userList can't peek behind curtain
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        drop_console: true, // strips console statements
        sequences: true,
        booleans: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.ENV': JSON.stringify('production')
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false
    }),
    new webpack.optimize.AggressiveMergingPlugin({
      minSizeReduce: 1,
      moveToParents: true,
      output: {
        comments: false // remove all comments
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
//  resolve.alias = {
//   "react": "preact-compat",
//   "react-dom": "preact-compat",
//   "react-redux": "preact-redux"
// };
};

const DEV_CONFIG = {
  devtool: "cheap-module-eval-source-map",
  devServer: {
    publicPath: "/",
    contentBase: [
      PATH.TMP
    ],
    compress: true,
    historyApiFallback: true,
    disableHostCheck: true,
  },
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         enforce: true,
  //         chunks: 'all',
  //         reuseExistingChunk: true
  //       }
  //     }
  //   }
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('index.html')
    })
  ]
};

const TARGET_CONFIG = Object.assign(BASE_CONFIG, isPROD ? PROD_CONFIG : DEV_CONFIG);

if (process.env.INSPECT) {
  TARGET_CONFIG.plugins.push(
    new BundleAnalyzerPlugin()
  )
}

exports.default = TARGET_CONFIG;
