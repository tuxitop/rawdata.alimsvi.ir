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
const ghPages = require('gulp-gh-pages');
const extend = require('gulp-extend');

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
        dirs.build,
        dirs.content + "css/main.css"
    ]);
});

// compile sass files
gulp.task('compass', () => {
    gulp.src(dirs.contents + '/sass/**/*.scss')
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

gulp.task('create-production-config', function() {
    gutil.log('Creating production config');
    gulp.src(['./config.json', './config.production.base.json'])
        .pipe(extend('config.production.json', true))
        .pipe(gulp.dest('./'));

    gutil.log('Setting production config for Wintersmith\'s use');
   runWintersmith.settings.configFile = 'config.production.json';

});

// Main Tasks

// Build task
gulp.task('build', ['clean', 'compass', 'minify-css', 'create-production-config'], function(cb) {
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

// deploy task
gulp.task ('deploy', ['build'], function() {
    return gulp.src(['./' + dirs.build + '/**/*', './CNAME'])
        .pipe(ghPages());
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
