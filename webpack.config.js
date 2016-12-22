config = {

  node: {
    fs: 'empty'
  },

  entry: {
    lib: './src/index.js',
    tests: './tests/index.js'
  },
  output: {
    filename: '[name].js',
    path: './dist'

  },
  module: {
    rules: [
      {test: /\.(js)$/, use: 'babel-loader'}
    ]
  },
  devtool: 'cheap-module-eval-source-map'  // 'eval-source-map'
}

module.exports = config