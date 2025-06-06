const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

function getPages(dir) {
	let output = [];
	const files = fs.readdirSync(dir);
	files.forEach((filename) => {
		const filePath = path.join(dir, filename);
		const stat = fs.statSync(filePath);
		if (filename.endsWith('.hbs') && !filename.startsWith('_')) {
			output.push(filePath.replace(/^src\//, ''));
		} else if (stat.isDirectory()) {
			output = output.concat(getPages(filePath));
		}
	});
	return output;
}

const pages = getPages('./src');

module.exports = {
	mode: 'production',
	devtool: false,
	devServer: {
		client: {
			overlay: {
				warnings: false,
			},
		},
		open: false,
		port: 8081,
		server: 'https',
		static: false,
	},
	entry: {
		functions: './index.js',
	},
	output: {
		chunkLoadingGlobal: 'app',
		filename: 'assets/js/[name].min.js?[contenthash]',
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
	},
	plugins: [
		...pages.map((filename) => (new HtmlWebpackPlugin({
			filename: filename.replace('.hbs', '.html'),
			template: path.join('./src', filename),
			templateParameters: { filename: filename.replace('.hbs', '.html') },
		}))),
		new MiniCssExtractPlugin({
			filename: 'assets/css/[name].min.css?[contenthash]',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: './public',
					to: './',
					globOptions: {
						ignore: ['.DS_Store', '**/.DS_Store'],
					},
				},
			],
			options: {
				concurrency: 100,
			},
		}),
		new BrowserSyncPlugin({
			proxy: 'https://localhost:8081',
			port: 3001,
			files: [
				'helpers/**/*',
				'js/**/*',
				'partials/**/*',
				'css/**/*',
				'src/**/*.hbs',
			],
			snippetOptions: {
				rule: {
					match: /<body[^>]*>/i,
					fn: (snippet, match) => (
						// Allow Browsersync to work with Content-Security-Policy without script-src 'unsafe-inline'.
						`${match}${snippet.replace('id=', 'nonce="browser-sync" id=')}`
					),
				},
			},
		}, {
			reload: false,
		}),
		new WorkboxPlugin.GenerateSW({
			clientsClaim: true,
			exclude: [
				'403.html',
				'404.html',
				'robots.txt',
				'sitemap.xml',
			],
			skipWaiting: true,
		}),
	],
	module: {
		rules: [
			{
				test: /\.hbs$/,
				use: [
					{
						loader: 'handlebars-loader',
						options: {
							helperDirs: path.join(__dirname, 'helpers'),
						},
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									'postcss-preset-env',
								],
							},
						},
					},
				],
			},
		],
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
			new CssMinimizerPlugin({
				minimizerOptions: {
					// Disable postcss-calc to avoid warnings about calc() inside hsl().
					// https://github.com/postcss/postcss-calc/issues/216
					preset: ['default', { calc: false }],
				},
			}),
		],
		splitChunks: {
			cacheGroups: {
				style: {
					name: 'style',
					type: 'css/mini-extract',
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
};
