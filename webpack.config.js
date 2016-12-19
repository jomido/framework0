config = {

  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: './dist'

  },
  module: {
    rules: [
      {test: /\.(js)$/, use: 'babel-loader'}
    ]
  },
  devtool: 'eval-source-map'
}

module.exports = config