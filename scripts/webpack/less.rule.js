'use strict';

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function(options) {
  return {
    test: /\.less$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            url: false,
            sourceMap: options.sourceMap,
            minimize: options.minimize,
          }
        },
        { loader:'less-loader', options: { sourceMap: options.sourceMap } }
      ],
    })
  };
}
