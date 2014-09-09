var gulp       = require("gulp");
var browserify = require("gulp-browserify");
var react      = require("gulp-react");
var stylus     = require("gulp-stylus");
var plumber    = require("gulp-plumber");
var nib        = require("nib");
var colors     = require("colors");
var notifier   = require("terminal-notifier");
var shell      = require('gulp-shell');
var express    = require('express');


var scriptPaths = ["./app/*.jsx", "./app/**/*.jsx"];
var stylePaths  = ["./app/*.styl", "./app/**/*.styl"];
var outPath     = "./public/build";
var publicPath  = "./public";


var notifyError = function(title){
	return function(err){
		console.log(title);
		console.log(err.message.red);
		notifier(err.message, {title: title});
	};
};


gulp.task("build-scripts", function() {
	gulp.src("./app/main.jsx")
		.pipe(plumber())
		.pipe(browserify({
			insertGlobals: true
		}))
		.on("error", notifyError("Browserify Build Error"))
		.pipe(react())
		.on("error", notifyError("React Build Error"))
		.pipe(gulp.dest(outPath));
});


gulp.task("build-style", function() {
	return gulp.src("./app/main.styl")
		.pipe(plumber())
		.pipe(stylus({use: [nib()]}))
		.on("error", notifyError("Stylus Build Error"))
		.pipe(gulp.dest(outPath));
});


gulp.task("watch", function() {
	gulp.watch(scriptPaths, ["build-scripts"]);
	gulp.watch(stylePaths, ["build-style"]);
});


gulp.task("server", function() {
	var app = express();
	app.use(express.static(publicPath));
	app.listen(8000);
});


gulp.task("build", ["build-scripts", "build-style"]);

gulp.task("default", ["build", "watch", "server"]);