const path = require('path');

const noop = path.resolve(__dirname, 'src/noop');

module.exports = {
  entry: './src/j5.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'p5.j5.js'
  },
  mode: 'production',
  resolve: {
    alias: {
      fs: noop,
      serialport: noop,
      bindings: noop,
      repl: noop,
      ws: noop
    }
  },
};