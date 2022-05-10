import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import DotEnvPlugin from 'dotenv-webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import { CliConfigOptions, Configuration } from 'webpack'

export default (_env: unknown, argv: CliConfigOptions): Configuration => ({
  entry: './src/index.tsx',
  devtool: argv.mode === 'production' ? undefined : 'source-map',
  devServer: {
    host: 'localhost',
    compress: true,
    contentBase: path.join(__dirname, 'public'),
    https: true,
    port: 4200,
    writeToDisk: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: argv.mode !== 'production'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: argv.mode !== 'production',
              plugins: () => [require('autoprefixer')]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: argv.mode !== 'production'
            }
          }
        ]
      },
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DotEnvPlugin({
      path: `./config/${argv.mode ?? 'local'}.env`,
      safe: false,
      silent: false,
      systemvars: true
    }),
    new HtmlWebpackPlugin({
      title: 'Caching',
      filename: 'index.html',
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ],
  target: 'web'
})
