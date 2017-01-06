//
// Gulp config file
// Author: Uthra Vijayaragavan
//

'use strict';
//
// variable declarations declaring required gulp packages
//
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    imageresize = require('gulp-image-resize'),
    htmlmin = require('gulp-htmlmin'),
    gutil = require('gulp-util');

var browserSync = require('browser-sync').create();
var ngrok = require('ngrok');
var psi = require('psi');
var sequence = require('run-sequence');
var site = '';
var portVal   = 3020;


//
// Gulp task that starts the local host server
// This task also watches for any change in any of the images or .js or .css or .html file
// in src folder and immediately minifies them and pushes them into dist
// followed by reloading the browser from dist thereby reflecting changes.
// This will ensure that any change made in src folder will consistent with the minified version
// in dist folder
//
gulp.task('browser-sync', function() {
    browserSync.init ({
     server: {
        baseDir: "./dist"
        }
    });
    // Watch for change in ./src/*.html and immedietely minify it and push it to
    // ./dist folder and reload browser
    gulp.watch('./src/*.html').on('change', function() {
        gulp.run('app-1');
        browserSync.reload();
        });
    // Watch for change in ./src/views/*.html and immedietely minify it and push it to
    // ./dist/views folder and reload browser
    gulp.watch('./src/views/*.html').on('change', function() {
        gulp.run('app-2');
        browserSync.reload();
        });
    // Watch for change in ./src/js/*.js and immedietely minify it and push it to
    // ./dist/js folder and reload browser
    gulp.watch('./src/js/*.js').on('change', function() {
        gulp.run('scripts-1');
        browserSync.reload();
        });
    // Watch for change in ./src/views/js/*.js and immedietely minify it and push it to
    // ./dist/views/js folder and reload browser
    gulp.watch('./src/views/js/*.js').on('change', function() {
        gulp.run('scripts-2');
        browserSync.reload();
        });
    // Watch for change in ./src/css/*.css and immedietely minify it and push it to
    // ./dist/css folder and reload browser
    gulp.watch('./src/css/*.css').on('change', function() {
        gulp.run('styles-1');
        browserSync.reload();
        });
    // Watch for change in ./src/views/css/*.css and immedietely minify it and push it to
    // ./dist/views/css folder and reload browser
    gulp.watch('./src/views/css/*.css').on('change', function() {
        gulp.run('styles-2');
        browserSync.reload();
        });
    // Watch for change in ./src/img/*.* and immedietely minify it and push it to
    // ./dist/img folder and reload browser
    gulp.watch('./src/img/*.*').on('change', function() {
        gulp.run('images-1');
        browserSync.reload();
        });
    // Watch for change in ./src/views/images/*.* and immedietely minify it and push it to
    // ./dist/views/images folder and reload browser
    gulp.watch('./src/views/images/*.*').on('change', function() {
        gulp.run('images-2');
        browserSync.reload();
        });
});

//
// Gulp task that starts the ngrok web server over proxy
//
gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(3000, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

// Gulp task that sequences localhost and ngrok
gulp.task('webhost', function (cb) {
  return sequence(
    'browser-sync',
    'ngrok-url',
    cb
  );
});

//
// Gulp task that minimizes html files in ./src folder
// and pushes them into ./dist folder
//
gulp.task('app-1', function() {
    gulp.src('./src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({
            extname: ".html"}))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});

//
// Gulp task that minimizes html files in ./src/views folder
// and pushes them into ./dist/views folder
//
gulp.task('app-2', function() {
    gulp.src('./src/views/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({
            dirname: "views",
            extname: ".html"}))
        .pipe(gulp.dest('./dist'));
});

//
// Gulp task that minimizes .js files in ./src/js folder
// and pushes them into ./dist/js folder
//
gulp.task('scripts-1', function() {
    gulp.src('./src/js/*.js')
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({
            dirname: "js",
            //suffix: "-min",
            extname: ".js"}))
        .pipe(gulp.dest('./dist'));
});

//
// Gulp task that minimizes .js files in ./src/views/js folder
// and pushes them into ./dist/views/js folder
//
gulp.task('scripts-2', function() {
    gulp.src('./src/views/js/*.js')
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({
            dirname: "views/js",
            //suffix: "-min",
            extname: ".js"}))
        .pipe(gulp.dest('./dist'));
});

//
// Gulp task that minimizes .css files in ./src/css folder
// and pushes them into ./dist/css folder
//
gulp.task('styles-1', function() {
    gulp.src('./src/css/*.css')
        .pipe(cleanCSS())
        .pipe(rename({
            dirname: "css",
            //suffix: "-min",
            extname: ".css"}))
        .pipe(gulp.dest('./dist'));
});

//
// Gulp task that minimizes .css files in ./src/views/css folder
// and pushes them into ./dist/views/css folder
//
gulp.task('styles-2', function() {
    gulp.src('./src/views/css/*.css')
        .pipe(cleanCSS())
        .pipe(rename({
            dirname: "views/css",
            //suffix: "-min",
            extname: ".css"}))
        .pipe(gulp.dest('./dist'));
});

//
// Gulp task that minimizes image files in ./src/img folder and
// pushes them into ./dist/img folder
//
gulp.task('images-1', function() {
    gulp.src('./src/img/*.*')
        .pipe(imagemin())
        .pipe(rename({
            dirname: "img"
            //suffix: "-min"
        }))
        .pipe(gulp.dest('./dist'));
});

//
// Gulp task that minimizes image files in ./src/views/images folder and
// pushes them into ./dist/views/images folder
//
gulp.task('images-2', function() {
    gulp.src('./src/views/images/*.*')
        .pipe(imagemin())
        .pipe(rename({
            dirname: "views/images"
            //suffix: "-min"
        }))
        .pipe(gulp.dest('./dist'));
});

//
// Gulp task that is a collection of all minify tasks
//
gulp.task('minify', function (cb) {
  return sequence(
    'app-1',
    'app-2',
    'scripts-1',
    'scripts-2',
    'styles-1',
    'styles-2',
    'images-1',
    'images-2',
    cb
  );
});

//
// Gulp task that resizes the image defined in the src
// as per the width and height specification
// and pushes them into the folder defined in dest
//
gulp.task('img-resize',function() {
    gulp.src('./src/views/images/pizzeria.jpg')
    .pipe(imageresize({
        width: 360,
        height: 270,
        crop: true,
        upscale: false
    }))
    .pipe(rename({
            dirname: "views/images"
            //suffix: "-thumb"
        }))
    .pipe(gulp.dest('./src'));
});

//
// To run the app simply type gulp from command prompt
//
gulp.task('default', ['webhost']);

