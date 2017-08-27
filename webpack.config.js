var path = require("path");

module.exports = {
  entry: {
    api: [
        './src/twhisprapi/elm-index.js'
    ],
    horse: [
        './src/tweetview/elm-index.js'
    ]
  },

  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      {
        test:    /\.html$/,
        exclude: /node_modules/,
        loader:  'file-loader?name=[name].[ext]',
      },
      {
        test:    /\.elm$/,
        include: [
            path.resolve(__dirname, "src/twhisprapi")
        ],
        exclude: [/elm-stuff/, /node_modules/],
        loader:  'elm-webpack-loader?verbose=true&warn=true&cwd=' + __dirname + "/src/twhisprapi",
      },
      {
        test:    /\.elm$/,
        include: [
            path.resolve(__dirname, "src/tweetview")
        ],
        exclude: [/elm-stuff/, /node_modules/],
        loader:  'elm-webpack-loader?verbose=true&warn=true&cwd=' + __dirname + "/src/tweetview",
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
    ],

    noParse: /\.elm$/,
  },

    node: {
        fs: 'empty',
        net: 'empty'
    },

  devServer: {
    inline: true,
    stats: { colors: true },
  },


};

