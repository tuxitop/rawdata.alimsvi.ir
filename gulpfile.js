/* gulpfile for wintersmith */

// load Gulp
const gulp = require('gulp');
const gutil = require('gulp-util');

// plugins
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const runWintersmith = require('run-wintersmith');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const ghPages = require('gulp-gh-pages');
const extend = require('gulp-extend');

// other
const del = require('del');
const bourbon = require('bourbon');
const path = require('path');

// Directories
const dirs = {
  build: 'dist',
  contents: 'contents',
  templates: 'templates'
};

// Helper tasks

// cleans the build dir
gulp.task('clean', () => {
  return del([
    dirs.build, dirs.content + 'css/main.css'
  ]);
});

// compile sass files
gulp.task('sass', () => {
  gulp.src(dirs.contents + '/sass/**/*.scss')
    .pipe(sass({includePaths: bourbon.includePaths}).on('error', sass.logError))
    .pipe(gulp.dest(dirs.contents + '/css'));
});

// autoprefix css attributes
gulp.task('autoprefixer', function () {
  return gulp.src(dirs.content + '/css/main.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dirs.contents + '/css'));
});

// minify CSS files
gulp.task('minify-css', () => {
  return gulp.src(dirs.contents + '/css/main.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest(dirs.contents + '/css'));
});

gulp.task('create-production-config', function() {
  gutil.log('Creating production config');
  gulp.src(['./config.json', './config.production.base.json']).pipe(extend('config.production.json', true)).pipe(gulp.dest('./'));

  gutil.log('Setting production config for Wintersmith\'s use');
  runWintersmith.settings.configFile = 'config.production.json';

});

// Main Tasks

// Build task
gulp.task('build', [
  'clean', 'sass', 'autoprefixer', 'minify-css', 'create-production-config'
], function(cb) {
  // Tell Wintersmith to build
  runWintersmith.build(function() {
    // Log on successful build
    gutil.log('Wintersmith has finished building!');

    // Tell gulp task has finished
    cb();
  });
});

// Preview task
gulp.task('preview', ['sass'], function() {
  // Tell Wintersmith to run in preview mode
  runWintersmith.preview();
});

// deploy task
gulp.task('deploy', ['build'], function() {
  return gulp.src([
    './' + dirs.build + '/**/*',
    './CNAME'
  ]).pipe(ghPages());
});

// Watch task
gulp.task('watch', ['preview'], function() {
  function reportChange(e) {
    gutil.log(gutil.template('File <%= file %> was <%= type %>, rebuilding...', {
      file: gutil.colors.cyan(e.path),
      type: e.type
    }));
  }

  gulp.watch(dirs.contents + '/sass/**/*.scss', ['sass']).on('change', reportChange);
});
