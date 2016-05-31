module.exports = {
	entry:"./src/pack.js",
	output:{
		path:__dirname,
		filename:"./dist/cyako.js"
	},
	module:{
		loaders:[
			{
        		test: /\.js?$/,
        		loader: 'babel',
        		query: {
        		  presets: ['es2015']
        		}
        	}
        ]
	}
};
