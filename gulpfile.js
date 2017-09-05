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

var realFavicon = require('gulp-real-favicon');

// -----------------------------------------------------------
// Compile SCSS to CSS
// -----------------------------------------------------------
gulp.task('styles', function () {
    gulp.src('./themes/lio/static/css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postCssProcessors))
        .pipe(gulp.dest('./themes/lio/static/css'))
});

// -----------------------------------------------------------
// Watch SCSS file changes
// -----------------------------------------------------------
gulp.task('watch', function () {
    // Watch .sass files
    gulp.watch('./themes/lio/static/css/style.scss', ['styles']);
});

/**************************************************/
/**************************************************/
// FAVICON
/**************************************************/
/**************************************************/

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function (done) {
    // File where the favicon markups are stored
    var FAVICON_DATA_FILE = 'themes/lio/static/favicon/faviconData.json';

    realFavicon.generateFavicon({
        masterPicture: 'themes/lio/static/favicon/favicon.png',
        dest: 'static/favicon/',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '0%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: true,
                    precomposedIcons: true,
                    declareOnlyDefaultIcon: true
                },
                appName: 'Sebastian Schirmer'
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#ffffff',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: true,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                },
                appName: 'Sebastian Schirmer'
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    name: 'Sebastian Schirmer',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: true,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: '54.6875',
                themeColor: '#ffffff'
            }
        },
        settings: {
            compression: 5,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function () {
        done();
    });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function () {
    // File where the favicon markups are stored
    var FAVICON_DATA_FILE = 'src/favicon/faviconData.json';

    return gulp.src(['src/index.html'])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('src'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function (done) {
    // File where the favicon markups are stored
    var FAVICON_DATA_FILE = 'tenants/' + tenantKey + '/favicon/faviconData.json';

    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function (err) {
        if (err) {
            throw err;
        }
    });
});
