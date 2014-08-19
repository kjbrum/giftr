// Gulp
var gulp = require('gulp');

// Plugins
var browserSync = require('browser-sync');
var cache = require('gulp-cache');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var htmlv = require('gulp-html-validator');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-ruby-sass'); // Requires ruby
var sftp = require('gulp-sftp');
var uglify = require('gulp-uglify');


// Define our paths
var paths = {
	scripts: 'js/**/*.js',
	styles: 'sass/**/*.scss',
	images: 'img/**/*.{png,jpg,jpeg,gif}'
};

var destPaths = {
	scripts: 'build/js',
	styles: 'build/css',
	images: 'build/img/',
	html: 'build/validated'
};

var filesToMove = ['sass/fonts'];

// Error Handling
	// Send error to notification center with gulp-notify
var handleErrors = function() {
	notify.onError({
		title: "Compile Error",
		message: "<%= error.message %>"
	}).apply(this, arguments);
	this.emit('end');
};

// Compile our Sass
gulp.task('styles', function() {
	return gulp.src(paths.styles)
		.pipe(plumber())
		.pipe(sass({sourcemap: true, sourcemapPath: paths.styles}))
		.pipe(gulp.dest(destPaths.styles))
		.pipe(notify('Styles task complete!'));
});

// Compile our Sass for build
gulp.task('build-styles', function() {
	return gulp.src(paths.styles)
		.pipe(plumber())
		.pipe(sass())
		.pipe(minifyCSS())
		.pipe(rename('main.css'))
		.pipe(gulp.dest(destPaths.styles))
		.pipe(notify('Build styles task complete!'));
});

// Lint, minify, and concat our JS
gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest(destPaths.scripts))
		.pipe(notify('Scripts task complete!'));
});

// Lint, minify, and concat our JS for build
gulp.task('build-scripts', function() {
	return gulp.src(paths.scripts)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(gulp.dest(destPaths.scripts))
		.pipe(notify('Scripts task complete!'));
});

// Compress Images
gulp.task('images', function() {
	return gulp.src(paths.images)
		.pipe(plumber())
		.pipe(cache(imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest(destPaths.images))
		.pipe(notify('Image(s) optimized!'));
});

// Compress Images for Build
gulp.task('build-images', function() {
	return gulp.src(paths.images)
		.pipe(plumber())
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(destPaths.images))
		.pipe(notify('Image(s) optimized!'));
});

// Validate HTML
gulp.task('validate', function() {
	return gulp.src('*.html')
		.pipe(plumber())
		.pipe(htmlv())
		.pipe(gulp.dest(destPaths.html))
		.pipe(notify('HTML validated!'));
});

// Deploy with SFTP
gulp.task('deploy', function() {
	return gulp.src(['./*', '!./node_modules'])
		.pipe(plumber())
		.pipe(sftp({
			host: 'website.com',
			port: 21,
			user: 'username',
			pass: 'password',
			remotePath: '/'
		}));
});

// Watch for changes made to files
gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.images, ['images']);
	gulp.watch('*.html', ['validate']);
});

// Browser Sync - autoreload the browser
// Additional Settings: http://www.browsersync.io/docs/options/
gulp.task('browser-sync', function () {
	var files = [
		'**/*.html',
		'**/*.php',
		'build/css/main.css',
		'build/js/main.min.js',
		'build/img/**/*.{png,jpg,jpeg,gif}'
	];
	browserSync.init(files, {
		server: {
			baseDir: './'
		},
		port: 5555,
		open: false
	});
});

gulp.task('clean', function() {
	return gulp.src('build').pipe(clean());
});

gulp.task('move', function() {
	gulp.src(filesToMove)
	.pipe(gulp.dest(destPaths.styles));
});

// Default Task
gulp.task('default', function(cb) {
	runSequence('clean', 'images', 'scripts', 'styles', 'validate', 'browser-sync', 'watch', cb);
});

// Build Task
gulp.task('build', function(cb) {
	runSequence('clean', 'build-images', 'build-scripts', 'build-styles', cb);
});
