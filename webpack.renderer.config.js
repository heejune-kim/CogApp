// webpack.renderer.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: path.resolve(__dirname, 'src/renderer/index.tsx'),
    // preload: path.resolve(__dirname, 'src/preload.ts'),
  },
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist/renderer'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,        // CSS 로더 예시
        use: [
          'style-loader',
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",                 // ★ Tailwind 적용 포인트
        ],
      },
      // 필요 시 이미지/폰트 로더 추가
       // ✅ SVG는 URL로 (img src=... 용)
      {
        test: /\.svg$/i,
        type: "asset/resource",
        generator: { filename: "assets/[name][hash][ext]" },
      },

      // ✅ 나머지 이미지
      {
        test: /\.(png|jpe?g|gif|webp|avif)$/i, // <-- svg 제외!
        type: "asset/resource",
        generator: { filename: "assets/[name][hash][ext]" },
      },

      // ✅ 폰트 파일 (로컬)
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: { filename: "fonts/[name][hash][ext]" },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/renderer/index.html'),
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist/renderer'),
    hot: true,
    port: 3000,
  },
};
