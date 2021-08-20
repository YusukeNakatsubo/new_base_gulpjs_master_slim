'use strict';

const { watch, series, task, gulp, src, dest, parallel } = require('gulp')
// Plugins
const GULP_NOTIFY       = require('gulp-notify')
const GULP_PLUMBER      = require('gulp-plumber')
const GULP_BROWSER_SYNC = require('browser-sync').create()
const GULP_SASS         = require('gulp-sass')
const GULP_SOURCEMAPS   = require('gulp-sourcemaps')
const GULP_SASS_GLOB    = require('gulp-sass-glob')
const GULP_AUTOPREFIXER = require('gulp-autoprefixer')
const GULP_BABEL = require('gulp-babel');
const GULP_UGLIFY = require('gulp-uglify-es').default;
const GULP_SLIM = require('gulp-slim');
const GULP_IMAGEMIN = require('gulp-imagemin');
const IMAGEMIN_MOZJPEG = require('imagemin-mozjpeg');
const IMAGEMIN_PNGQUANT = require('imagemin-pngquant');
const GULP_CHANGED = require('gulp-changed');
// const htmlhint = require('gulp-htmlhint');
// const csslint = require('gulp-csslint');
// const eslint = require('gulp-eslint');

/*
 * Path Settings
 */
const GULP_PATHS = {
  ROOT_DIR: 'dist/',
  ALL_DIR: 'dist/**/*.index.html',
  SRC_SLIM: 'src/slim/**/*.slim',
  SRC_SASS: 'src/assets/scss/**/*.scss',
  SRC_JS: 'src/assets/js/**/*.js',
  SRC_IMG: 'src/assets/img/**/*',
  OUT_SLIM: 'dist/',
  OUT_CSS: 'dist/assets/css',
  OUT_JS: 'dist/assets/js',
  OUT_IMG: 'dist/assets/img',
};

/*
 * Browser-sync Task
 */
const browserSyncAbility = () =>
  GULP_BROWSER_SYNC.init({
    server: {baseDir:GULP_PATHS.ROOT_DIR},
    port: 8080,
    reloadOnRestart: true
  });
const watchBrowserSync = () => watch(GULP_PATHS.ROOT_DIR, browserSyncAbility)

// const browserReloadAbility = () =>
//   GULP_BROWSER_SYNC.reload()

/*
 * Slim Task
 */
const compileSlim = () =>
  src(GULP_PATHS.SRC_SLIM)
  .pipe(GULP_PLUMBER({errorHandler:GULP_NOTIFY.onError('<%= error.message %>')}))
  .pipe(GULP_SLIM({
    require: 'slim/include',
    pretty: true,
    options: 'include_dirs=["src/slim/inc"]'
  }))
  .pipe(dest(GULP_PATHS.OUT_SLIM))
  .pipe(GULP_BROWSER_SYNC.stream())
// 相対パスで外部ファイルがうまく読み込めない

/*
* Scss Task
*/
const compileSass = () =>
  src(GULP_PATHS.SRC_SASS)
  .pipe(GULP_SOURCEMAPS.init())
  .pipe(GULP_PLUMBER({errorHandler:GULP_NOTIFY.onError('<%= error.message %>')}))
  .pipe(GULP_SASS_GLOB())
  .pipe(GULP_SASS({outputStyle:'compressed'}))
  .pipe(GULP_AUTOPREFIXER({cascade:false}))
  .pipe(GULP_SOURCEMAPS.write('maps'))
  .pipe(dest(GULP_PATHS.OUT_CSS))
  .pipe(GULP_BROWSER_SYNC.stream())

/*
* Javascript Task
*/
const compileJs = () =>
  src(GULP_PATHS.SRC_JS)
  .pipe(GULP_SOURCEMAPS.init())
  .pipe(GULP_PLUMBER({errorHandler:GULP_NOTIFY.onError('<%= error.message %>')}))
  .pipe(GULP_BABEL())
  .pipe(GULP_UGLIFY({compress:true}))
  .pipe(GULP_SOURCEMAPS.write('maps'))
  .pipe(dest(GULP_PATHS.OUT_JS))
  .pipe(GULP_BROWSER_SYNC.stream())

/*
* Images Task
*/
const compressImg = () =>
  src(GULP_PATHS.SRC_IMG)
  .pipe(GULP_CHANGED(GULP_PATHS.OUT_IMG))
  .pipe(
    GULP_IMAGEMIN([
      IMAGEMIN_PNGQUANT({
        quality: [.60, .70], // 60~70
        speed: 1
      }),
      IMAGEMIN_MOZJPEG({quality: 65}),
      GULP_IMAGEMIN.svgo(),
      GULP_IMAGEMIN.optipng(),
      GULP_IMAGEMIN.gifsicle({optimizationLevel: 3})
    ])
  )
  .pipe(dest(GULP_PATHS.OUT_IMG))

/*
* Watch Files
*/
const watchSassFiles = () => watch(GULP_PATHS.SRC_SASS, compileSass)
const watchJsFiles = () => watch(GULP_PATHS.SRC_JS, compileJs)
const watchSlimFiles = () => watch(GULP_PATHS.SRC_SLIM, compileSlim)
const watchImgFiles = () => watch(GULP_PATHS.SRC_IMG, compressImg)


/*
* Default Task
*/
const watchStaticContents = () =>
  watchSassFiles()
  watchJsFiles()
  watchSlimFiles()
  watchImgFiles()

const defaultTask = () =>
  watchBrowserSync()
  watchStaticContents()
  compileSass()
  compileJs()
  compileSlim()
  compressImg()

exports.default = defaultTask

/*
* lint Task
*/
// lint
// function htmlLint() {
//   return gulp.src('dist/**/*.html')
//     .pipe(htmlhint())
//     .pipe(htmlhint.reporter());
// }

// function cssLint() {
//   return gulp.src('dist/assets/**/*.css')
//   .pipe(csslint())
//   .pipe(csslint.formatter());
// }

// function esLint() {
//   return gulp.src('dist/assets/**/*.js')
//   .pipe(eslint({useEslintrc: true}))
//   .pipe(eslint.format())
//   .pipe(eslint.failAfterError())
// }

// gulp.task('html-lint', htmlLint);
// gulp.task("css-lint", cssLint);
// gulp.task('eslint', esLint);
// gulp.task('lint',
// gulp.series(
//   htmlLint, cssLint, esLint
//   )
// );
