'use strict';

const browserSync = require('browser-sync').create();
const cssMqpacker = require('css-mqpacker');
const cssNano = require('cssnano');
const cssNext = require('postcss-cssnext');
const ejs = require('gulp-ejs');
const gulp = require('gulp');
const imageOp = require('gulp-image-optimization');
const postcss = require('gulp-postcss');
const responsive = require('gulp-responsive');
const responsiveType = require('postcss-responsive-type');
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
    responsiveType,
    size,
    cssNext,
    cssMqpacker,
    cssNano({
      autoprefixer: ['ie >= 10', '> 2% in RU']
    }),
  ];
  return gulp.src('src/postcss/style.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());
});

// Images

gulp.task('images', (cb) => {
  gulp.src(['src/images/**/*'])
  .pipe(responsive({
    '*.*':[
      {
        width: 400,
        height: 568,
        crop: 'center',
        rename: ({
          suffix: '-sm'
        })
      },{
        width: 960,
        height: 1000,
        crop: 'center',
        rename: ({
          suffix: '-md'
        }),
      }, {
        width: 1680,
        height: 1120,
        crop: 'center',
      },
    ]},
    {
      errorOnEnlargement: false
    }
  ))
  .pipe(imageOp({
    optimizationLevel: 5,
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest('dist/images')).on('end', cb).on('error', cb);
});

// Server

gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: './dist/'
    },
    open: true
  });
});
