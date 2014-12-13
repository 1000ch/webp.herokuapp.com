var gulp    = require('gulp');
var concat  = require('gulp-concat');
var uglify  = require('gulp-uglify');
var csso    = require('gulp-csso');
var csscomb = require('gulp-csscomb');

gulp.task('js', function () {
  gulp.src(['public/js/app.js'])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
});

gulp.task('css', function () {
  gulp.src(['public/css/app.css'])
    .pipe(concat('app.min.css'))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest('public/css'))
});

gulp.task('default', ['js', 'css']);