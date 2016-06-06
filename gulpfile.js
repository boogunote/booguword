var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templates = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var rev = require('gulp-rev-append');
// var autoprefixer = require('gulp-autoprefixer');

// Minify and templateCache your Angular Templates
// Add a 'templates' module dependency to your app:
// var app = angular.module('appname', [ ... , 'templates']);

gulp.task('templates', function () {
  return gulp.src([
      './src/**/*.html',
      '!./src/index.html',
      '!./src/index-dist.html',
      '!./src/bower_components/**',
      '!./src/css/**',
      '!./src/vendor/**'
    ])
    .pipe(minifyHTML({
      quotes: true
    }))
    .pipe(templates('templates.js', {standalone: true})) // should be true, otherwise will get error in latest angularjs.
    .pipe(gulp.dest('./tmp'));
});

gulp.task('font', function() {
  return gulp.src(['./src/bower_components/bootstrap/dist/fonts/**/*'], {base: './src/bower_components/bootstrap/dist/'})
  .pipe(gulp.dest('dist/'))
})

gulp.task('images', function() {
  return gulp.src(['./src/images/**/*'], {base: './src/images/'})
  .pipe(gulp.dest('dist/images/'))
})

var cssList = [
  './src/bower_components/angular-bootstrap/ui-bootstrap-csp.css',
  './src/bower_components/bootstrap/dist/css/bootstrap.css',
  './src/js/app.css'
]

gulp.task('cssWithMap', function() {
  return gulp.src(cssList)
    .pipe(sourcemaps.init())
    // .pipe(autoprefixer({
    //   browsers: ['last 2 versions'],
    //   cascade: false
    // }))
    .pipe(concat('app.css'))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('css', function() {
  return gulp.src(cssList)
    // .pipe(autoprefixer({
    //   browsers: ['last 2 versions'],
    //   cascade: false
    // }))
    .pipe(concat('app.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('cssWithoutMinify', function() {
  return gulp.src(cssList)
    // .pipe(autoprefixer({
    //   browsers: ['last 2 versions'],
    //   cascade: false
    // }))
    .pipe(concat('app.css'))
    // .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('vendor', function() {
  return gulp.src(['./src/vendor/**/*'], {base: './src'})
  .pipe(gulp.dest('dist'))
})

gulp.task('clean', function() {
  return del.sync([
      './dist/**',
      './tmp/**'
    ]);
});

gulp.task('index', function() {
  return gulp.src('./src/index-dist.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
})

gulp.task('copyConfig', function() {
  return gulp.src('./src/config.json')
    .pipe(gulp.dest('dist'));
})

gulp.task('copyFavicon', function() {
  return gulp.src('./src/favicon.ico')
    .pipe(gulp.dest('dist'));
})

gulp.task('copyi18n', function() {
  return gulp.src('./src/i18n/**/*')
    .pipe(gulp.dest('dist/i18n'));
})

gulp.task('copydocs', function() {
  return gulp.src('./src/docs/**/*')
    .pipe(gulp.dest('dist/docs'));
})

var jsList = [
  './src/bower_components/angular/angular.js',
  './src/bower_components/angular-ui-router/release/angular-ui-router.js',
  './src/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  // './src/bower_components/angular-translate/angular-translate.js',
  './src/bower_components/angular-sanitize/angular-sanitize.js',
  './src/bower_components/wilddog/wilddog.js',
  './tmp/templates.js',
  './src/js/services/common.js',
  './src/js/login/index.js',
  './src/js/main/index.js',
  './src/js/ref/index.js',
  './src/js/trans/index.js',
  './src/js/components/index.js',
  './src/js/components/word/index.js',
  './src/js/components/word/new.js',
  './src/js/components/sentence/index.js',
  './src/js/components/sentence/new.js',
  './src/js/app.js',
]

gulp.task('static', ['clean', 'templates', 'font', 'images', 'css', 'vendor', 'index', 'copyi18n', 'copydocs', 'copyFavicon'], function() {
  return gulp.src(jsList)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('staticWithMap', ['clean', 'templates', 'font', 'images', 'css', 'vendor', 'index', 'copyi18n', 'copydocs', 'copyFavicon'], function() {
  return gulp.src(jsList)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task('staticWithoutMinify', ['clean', 'templates', 'font', 'images', 'cssWithoutMinify', 'vendor', 'index', 'copyi18n', 'copydocs', 'copyFavicon'], function() {
  return gulp.src(jsList)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('rev', ['static', 'copyConfig'], function() {
  gulp.src('dist/index.html')
    .pipe(rev())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['rev']);

gulp.task('tar', ['static'], function () {
  gulp.src('./dist/**/*', { base: './dist' })
    .pipe(tar('static.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('./'));
});

var connect = require('gulp-connect');
// var historyApiFallback = require('connect-history-api-fallback');
var runSequence = require('run-sequence');
 
gulp.task('connectDev', function () {
  connect.server({
    root: 'src',
    port: 8000,
    fallback: 'src/index.html',
    livereload: true,
  });
});
 
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 8001,
    fallback: 'dist/index.html',
    livereload: true,
  });
});

gulp.task('after', function(cb) {
  connect.reload();
  console.log('Build Success...............................................')
  cb();
})

gulp.task('buildReload', [], function (cb) {
  runSequence('static', 'copyConfig', 'after', cb);
});
 
gulp.task('watch', function () {
  gulp.watch(['./src/**/*'], ['buildReload']);
});
 
gulp.task('default', ['connectDist', 'connectDev', 'watch']);