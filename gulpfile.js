const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const connect = require('gulp-connect');
const open = require('open');
const pxtorem = require('postcss-pxtorem');
const image = require('gulp-image');

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

// 合并js
gulp.task('concatJS', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('build.js'))
    .pipe(gulp.dest('dist/js'));
});
// 压缩js
gulp.task('uglifyJS', function() {
  return gulp.src('dist/js/build.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: 'min'
    }))
    .pipe(gulp.dest('dist/js'));
});

// image 图片压缩
gulp.task('image', function() {
  return gulp.src('src/images/*.*')
    .pipe(image())
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
})

// pxtorem 配置项
let pxtoremOptions = {
  rootValue: 75,  // 是根标签的 font-size 大小
  unitPrecision: 5, // 是转换成rem后的小数位数
  propList: ['*'],  // 是需要转换的属性列表
  selectorBlackList: [],  //则是一个对css选择器进行过滤的数组，比如你设置为['fs']，那例如fs-xl类名，里面有关px的样式将不被转换，这里也支持正则写法。
};

// 单页面
gulp.task('oneAutoprefixerCSS', function() {
  return gulp.src('src/css/*.css')
    .pipe(postcss([autoprefixer(), pxtorem(pxtoremOptions)]))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

// 页面刷新
gulp.task('html', function() {
  return gulp.src('*.html')
    .pipe(connect.reload());
})

// 实时加载
gulp.task('server', function() {
  connect.server({
    root: '',
    livereload: true,
    port: 3000
  });

  open('http://localhost:3000/');

  gulp.watch('src/css/*.css', gulp.series('oneAutoprefixerCSS'));
  gulp.watch('*.html', gulp.series('html'));
  gulp.watch('src/images/*.*', gulp.series('image'));

});


gulp.task('CSS', gulp.series('concatCSS', 'autoprefixer', 'cleanCSS'));
gulp.task('JS', gulp.series('concatJS', 'uglifyJS'));

gulp.task('default', gulp.series('CSS', 'JS'));