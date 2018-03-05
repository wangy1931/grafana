const path = require('path');
const {CheckerPlugin} = require('awesome-typescript-loader')

module.exports = {
  target: 'web',
  stats: {
    children: false
  },
  entry: {
    app: './public/app/index.ts',
  },
  output: {
    path: path.resolve(__dirname, '../../public/build'),
    filename: '[name].[chunkhash].js',
    publicPath: "public/build/",
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.es6', '.js', '.json', '.less'],
    alias: {
    },
    modules: [
      path.resolve('public'),
      path.resolve('node_modules')
    ],
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'tslint-loader',
          options: {
            emitErrors: true,
            typeCheck: false,
          }
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "awesome-typescript-loader",
            options: {
              "useBabel": true,
              "babelOptions": {
                "babelrc": false,
                "plugins": [
                  ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
                  //  ["env", { "targets": "last 2 versions, ie 11", "modules": false }]
                ],
              },
              "useCache": true
            }
          }
        ]
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            query: 'jQuery'
          },
          {
            loader: 'expose-loader',
            query: '$'
          }
        ]
      },
      {
        test: /\.html$/,
        exclude: /index\.template.html/,
        use: [
          { loader:'ngtemplate-loader?relativeTo=' + (path.resolve(__dirname, '../../public')) + '&prefix=public'},
          {
            loader: 'html-loader',
            options: {
              attrs: [],
              minimize: true,
              removeComments: false,
              collapseWhitespace: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
  ]
};