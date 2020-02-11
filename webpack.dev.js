const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode : 'development',

	// output: {
	// 	publicPath: '/'
	// },
  
	devServer : {
		contentBase : './src',
		watchContentBase : true,
		historyApiFallback: true,
	},

	devtool : "source-map"
});