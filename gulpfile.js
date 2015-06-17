/*global require*/
/* Require the gulp and node packages */
var gulp = require('gulp'),
    pkg = require('./package.json'),
    header = require('gulp-header'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    debug = require('gulp-debug'),
    runSequence = require('run-sequence');


/* Set up the banner */
var banner = [
    '/**',
    ' * @name <%= pkg.name %>: <%= pkg.description %>',
    ' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */'
].join('\n');

/* Error notificaton*/
var onError = function(err) {
    notify.onError({
        title:    "Gulp",
        subtitle: "Failure!",
        message:  "Error: <%= error.message %>",
        sound:    "Beep"
    })(err);

    this.emit('end');
};

/************************
 *  Task definitions 
 ************************/
/* Concat the js */
gulp.task('js', function() {
    return gulp.src('src/*.js')
		.pipe(header(banner, {pkg : pkg}))
		.pipe(debug())
		.pipe(gulp.dest('dist/'));
});

/************************
 *  Task collection API
 ************************/
gulp.task('default', ['js']);


