'use strict';

/**
 * Requires
 */
var gulp = require('gulp');
var sass = require('gulp-sass');

// PostCSS Plugins
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var postCssProcessors = [
    autoprefixer({ browsers: ['last 3 versions', 'ie >= 8', 'Edge >= 12', 'Safari >= 8', 'iOS >= 8', 'Android >= 4'] })
];

// -----------------------------------------------------------
// ...
// -----------------------------------------------------------
gulp.task('styles', function () {
    gulp.src('./themes/lio/static/css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postCssProcessors))
        .pipe(gulp.dest('./themes/lio/static/css'))
});

// -----------------------------------------------------------
// ...
// -----------------------------------------------------------
gulp.task('watch', function () {
    // Watch .sass files
    gulp.watch('./themes/lio/static/css/style.scss', ['styles']);
});
