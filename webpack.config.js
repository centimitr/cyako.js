module.exports = {
    entry: "./src/pack.js",
    output: {
        filename: "./dist/bundle.js",
    },
    devtool: "source-map",
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".js"]
    },
    module: {
        loaders: [	
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],
        // preLoaders: [
        //     { test: /\.js$/, loader: "source-map-loader" }
        // ]
    },
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    },
};
