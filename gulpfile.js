/*
gulpfile for wintersmith
*/

// load Gulp
const gulp = require('gulp');
const gutil = require('gulp-util');

// plugins
const compass = require('gulp-compass');
const cleanCSS = require('gulp-clean-css');
const refresh = require('gulp-livereload');
const runWintersmith = require('run-wintersmith');

// other
const del = require('del');
const path = require('path');

// Directories
const dirs = {
    build: 'build',
    contents: 'contents',
    templates: 'templates'
};

// Helper tasks

// cleans the build dir
gulp.task('clean', () => {
    return del([
        dirs.build
    ]);
});

// compile sass files
gulp.task('compass', () => {
    gulp.src(dirs.contents + '/sass/*.scss')
        .pipe(compass({
            project: path.join(__dirname, dirs.contents),
            css: 'css',
            sass: 'sass'
        }))
        .pipe(gulp.dest("css"));
});

// minify CSS files
gulp.task('minify-css', () => {
    return gulp.src(dirs.contents + "/css/main.css")
        .pipe(cleanCSS())
        .pipe(gulp.dest(dirs.contents + "/css"));
});

// Main Tasks

// Build task
gulp.task('build', ['clean', 'compass', 'minify-css'], function(cb) {
    // Tell Wintersmith to build
    runWintersmith.build(function(){
        // Log on successful build
        gutil.log('Wintersmith has finished building!');

        // Tell gulp task has finished
        cb();
    });
});

// Preview task
gulp.task('preview', ['compass'], function() {
    // Tell Wintersmith to run in preview mode
    runWintersmith.preview();
});

// Watch task
gulp.task('watch', ['preview'], function(){
    function reportChange(e) {
        gutil.log(gutil.template('File <%= file %> was <%= type %>, rebuilding...', {
            file: gutil.colors.cyan(e.path),
            type: e.type
        }));
    }

    gulp.watch(dirs.contents + '/sass/**/*.scss', ['compass'])
        .on('change', reportChange);
});
