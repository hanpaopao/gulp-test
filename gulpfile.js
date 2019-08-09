const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// 合并css
gulp.task('concatCSS', function() {
  return gulp.src('src/css/*.css')
    .pipe(concat('build.css'))
    .pipe(gulp.dest('dist/css'));
});
// 自动补全浏览器前缀
gulp.task('autoprefixer', function() {
  return gulp.src('dist/css/build.css')
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('dist/css'));
});
// 压缩css
gulp.task('cleanCSS', function() {
  return gulp.src('dist/css/build.css')
    .pipe(cleanCSS()) //  压缩
    .pipe(rename({
      suffix: '.min'
    })) //  重命名
    .pipe(gulp.dest('dist/css')); //  写入路径
});

gulp.task('CSS', gulp.series('concatCSS', 'autoprefixer', 'cleanCSS'))

gulp.task('default', gulp.series('CSS'));