(function setupGulp() {

  'use strict';

  let gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    istanbul = require('gulp-istanbul'),
    jasmine = require('gulp-jasmine'),
    config = require('./package.json');

  gulp.task('build', buildJs);
  gulp.task('test', ['build', 'pre-test'], test);

  gulp.task('pre-test', preTest);

  function buildJs() {

    return gulp
      .src([
        'src/index.js',
        'src/**/*.js'
      ], {base: 'src'})
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat(config.main))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('.'));

  }

  function preTest() {

    return gulp.src(['src/**/*.js'])
      .pipe(istanbul())
      .pipe(istanbul.hookRequire());

  }

  function test() {

    return gulp.src(['spec/**/*-spec.js'])
      .pipe(jasmine())
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({thresholds: {global: 90}}));

  }

}());
