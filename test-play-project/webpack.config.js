const webpack = require('webpack');
const flowright = require('lodash.flowright');
const TerserPlugin = require('terser-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || '';

function generateBaseConfig() {
  const config = {
    mode: '',
    devtool: '',
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {},
    // We never need all of the moment locales.
    plugins: [
      new MomentLocalesPlugin({
        localesToKeep: ['es-us'],
      }),
    ],
  }

  return config
}

function applyEnv(config) {
  let newConfig;

  if (nodeEnv === 'production') {
    newConfig = {
      ...config,
      mode: 'production',
      devtool: 'source-map',
      optimization: {
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              chunks: 'initial',
              name: 'javascripts/vendor.js',
              enforce: true,
            },
          },
        },
        minimizer: [
          new TerserPlugin({
            sourceMap: true,
            parallel: true,
          }),
        ],
      },
    };
  } else {
    newConfig = {
      ...config,
      mode: 'development',
      devtool: 'cheap-module-eval-source-map',
    };
  }

  return newConfig;
}

function applyLoaders(config) {
  let newConfig;

  newConfig = {
    ...config,
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [],
        }
      }],
    },
  };

  return newConfig;
}

const configurate = flowright(
  applyLoaders,
  applyEnv,
  generateBaseConfig,
);

module.exports = configurate();
