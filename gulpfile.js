
var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    jshint     = require('gulp-jshint'),
    header     = require('gulp-header'),
    stylish    = require('jshint-stylish'),
    streamify  = require('gulp-streamify'),
    uglify     = require('gulp-uglify'),
    rename     = require('gulp-rename'),
    mocha      = require('gulp-mocha'),
    detect     = require('gulp-detect'),
    pkg        = require('./package.json');

var headerText = '/*****************************\n setidle\n v' + pkg.version + '\n ' + pkg.license + ' license\n *****************************/\n\n';

gulp.task('lint', function () {
    return gulp.src(['./src/**.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('test', ['build'], function () {
    gulp.src('./test/*.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}))
});

gulp.task('build', ['lint'], function() {
    return gulp.src(['./src/config.js', './src/DOMEventEmitter.js', './src/SetIdle.js'])
        .pipe(concat('setidle.js'))
        .pipe(detect('SetIdle'))
        .pipe(header(headerText))
        .pipe(gulp.dest('./'))
        .pipe(rename('setidle.min.js'))
        .pipe(streamify(uglify()))
        .pipe(header(headerText))
        .pipe(gulp.dest('./'));
});