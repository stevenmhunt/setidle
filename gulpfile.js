
var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    pkg        = require('./package.json'),
    jshint     = require('gulp-jshint'),
    header     = require('gulp-header'),
    stylish    = require('jshint-stylish'),
    streamify  = require('gulp-streamify'),
    uglify     = require('gulp-uglify'),
    rename     = require('gulp-rename'),
    pkg        = require('./package.json');

var headerText = '/*****************************\n setidle\n v' + pkg.version + '\n ' + pkg.license + ' license\n *****************************/\n\n';

gulp.task('lint', function () {
    return gulp.src(['./src/**.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('build', ['lint'], function() {
    return gulp.src(['./src/_header.txt', './src/config.js', './src/DOMEventEmitter.js', './src/SetIdle.js', './src/start.js', './src/_footer.txt'])
        .pipe(concat('setidle.js'))
        .pipe(header(headerText))
        .pipe(gulp.dest('./'))
        .pipe(rename('setidle.min.js'))
        .pipe(streamify(uglify()))
        .pipe(header(headerText))
        .pipe(gulp.dest('./'));
});