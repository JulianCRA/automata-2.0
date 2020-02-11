const HtmlWebPackPlugin = require("html-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
	resolve : {
		extensions : ['.js', '.jsx', '.ts', '.tsx']
	},
	
	module : {
		rules : [
			{
				test : /\.jsx?$/,
				exclude : /node_modules/,
				use : {
					loader : "babel-loader",
					options : {
						"presets" : [
							"@babel/preset-env", 
							"@babel/preset-react"
						],
					
						"plugins" : [
							["@babel/plugin-proposal-class-properties", { "loose": true }],
							["@babel/plugin-syntax-class-properties"]
						]
					}
				}
			},
			{
				test : /\.html$/,
				use : [
					{
						loader: "html-loader"
					}
				]
			},
			{
				test : /\.module\.css$/,
				use : [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
							modules:{
								localIdentName: '[name]_[local]_[hash:base64:5]',
							},
							localsConvention: 'camelCaseOnly'
						}	
					}
				]
			},
			{
				test : /\.css$/,
				use : [
					"style-loader",
					"css-loader",
				],
				exclude: /\.module\.css$/,
			},
			{
				test : /\.(png|svg|jpe?g|gif)$/,
				use : [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							//outputPath: 'imgs/'
						}
					}	
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/'
						}
					}
				]
			}
		]
	},

	plugins : [
		new HtmlWebPackPlugin({
			template : "./src/index.html",
			filename : "./index.html"
		}),
	],
};
