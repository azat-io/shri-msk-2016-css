'use strict';

const browserSync = require('browser-sync').create();
const cssMqpacker = require('css-mqpacker');
const cssNext = require('postcss-cssnext');
const gulp = require('gulp');
const imageOp = require('gulp-image-optimization');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const size = require('postcss-size');

gulp.task('default', ['server'], () => {
  gulp.watch('src/pug/**', (event) => {
    gulp.run('pug');
  });
  gulp.watch('src/postcss/**', (event) => {
    gulp.run('postcss');
  });
});

gulp.task('build', () => {
  gulp.run('pug', 'postcss', 'images', 'move');
});


// Pug

gulp.task('pug', () => {
  gulp.src('src/pug/index.pug')
    .pipe(pug({
      pretty: false,
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
});

// PostCSS

gulp.task('postcss', () => {
  const processors = [
    size,
    cssNext({
      autoprefixer: ['ie >= 10', '> 2% in RU']
    }),
    cssMqpacker,
  ];
  return gulp.src('src/postcss/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());
});

// Images

gulp.task('images', (cb) => {
  gulp.src(['src/images/**/*'])
  .pipe(imageOp({
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest('dist/images')).on('end', cb).on('error', cb);
});

// Moving

gulp.task('move', () => {
  const filesToMove = [
    './src/fonts/**/*.*',
    './src/favicon.ico'
  ];
  gulp.src(filesToMove, { base: './src/' })
  .pipe(gulp.dest('./dist/'));
});

// Server

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    open: false
  });
});
