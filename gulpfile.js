const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const csso = require('gulp-csso');
const csscomb = require('gulp-csscomb');

gulp.task('js', () => {
  return gulp.src(['public/js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
});

gulp.task('css', () => {
  return gulp.src(['public/css/app.css'])
    .pipe(concat('app.min.css'))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest('public/css'))
});

gulp.task('default', ['js', 'css']);
