const {src, dest, series, watch} = require('gulp')
const concat = require('gulp-concat')
const htmlMin = require('gulp-htmlmin')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('sass'))
const bulk = require('gulp-sass-bulk-importer')
const cleanCSS = require('gulp-clean-css')
const image = require('gulp-image')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const uglify = require('gulp-uglify-es').default
const gulpif = require('gulp-if')
const prod = require('yargs').argv
const browserSync = require('browser-sync').create()


const clean = () => {
  return del(['dist'])
}

const styles = () => {
  return src('src/css/scss/**/*.scss')
  .pipe(gulpif(!prod.prod, sourcemaps.init()))
  .pipe(bulk())
  .pipe(sass({
    outputStyle: 'compressed'
  }).on('error', sass.logError))
  .pipe(gulpif(prod.prod, autoprefixer({
    cascade: false
  })))
  .pipe(gulpif(prod.prod, cleanCSS({
    level: 2
  })))
  .pipe(concat('style.css'))
  .pipe(gulpif(!prod.prod, sourcemaps.write()))
  .pipe(dest('dist/css'))
  .pipe(browserSync.stream())
}

const css = () => {
  return src('src/css/**/*.css')
    .pipe(gulpif(!prod.pdod, sourcemaps.init()))
    .pipe(gulpif(prod.prod, autoprefixer({
      cascade: false
    })))
    .pipe(gulpif(prod.prod, cleanCSS({
        level: 2
    })))
    .pipe(gulpif(!prod.prod, sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

const htmlMinify = () => {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}


const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

const images = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/*.png',
    'src/img/*.svg',
    'src/img/**/*.jpeg'
  ])
  .pipe(gulpif(prod.prod, image()))
  .pipe(dest('dist/img'))
}

const fonts = () => {
  return src([
    'src/fonts/**/*.woff',
    'src/fonts/**/*.woff2'
  ])
  .pipe(dest('dist/fonts'))
}

watch('src/**/*.html', htmlMinify)
watch('src/css/**/*.css', css)
watch('src/css/scss/**/*.scss', styles)

exports.styles = styles
exports.htmlMinify = htmlMinify
exports.default = series(clean, htmlMinify, css, styles, images, fonts, watchFiles)
