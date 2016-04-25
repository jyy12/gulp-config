var gulp = require('gulp'),
    less=require('gulp-less'),
    jade=require('gulp-jade'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    uglify = require('gulp-uglify'),
    concat=require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps=require('gulp-sourcemaps');

gulp.task('less', function () {
    gulp.src('src/less/*.less')
        .pipe(sourcemaps.init())
        .pipe(less({compress: true}))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 5 version']
        }))
        .pipe(gulp.dest('dist/style'));
});

gulp.task('jade', function () {
    gulp.src('src/jade/*.jade')
      .pipe(jade({pretty: '    '}))   //生成html以4个空格缩进
      //.pipe(minify())
      .pipe(gulp.dest('dist/html'));
});

gulp.task('imagemin', function () {
    gulp.src('src/img/*')
		.pipe(imagemin({
			progressive: true,
            optimizationLevel:1,  //优化压缩 数字越大压缩越多 0~7
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/img'));
    gulp.src('src/sso/img/*')
		.pipe(imagemin({
			progressive: true,
            optimizationLevel:1,  //优化压缩 数字越大压缩越多 0~7
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/style/sso/img'));
});


gulp.task('copy', function () {
    gulp.src(['src/sso/*.css'])
        .pipe(gulp.dest('dist/style/sso/'));
});


gulp.task('compress', function() {
  return gulp.src('src/js/lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/lib'));
});

gulp.task('scripts', function() {
  gulp.src([
        'src/js/lib/package/*.js',
        'src/js/modules/package/*.js'
      ])
    .pipe(concat('base.js',{newLine:';'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

  gulp.src(['src/js/modules/*.js'])
    //.pipe(uglify())
    .pipe(gulp.dest('dist/js/modules/'));

  gulp.src(['src/js/inline/package/*.js'])
    .pipe(concat('common.js',{newLine:';'}))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function() {
    gulp.src('dist')
        .pipe(clean());
});


gulp.task('watch', function(){
    gulp.watch(['src/less/*.less','src/less/**/*.less'],['less']);
    gulp.watch(['src/jade/*.jade','src/jade/**/*.jade'],['jade']);
    gulp.watch(['src/js/*/*.js','src/js/*/*/*.js'],['scripts']);
    gulp.watch(['src/img/**'],['imagemin']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

gulp.task('default', ['less', 'jade','imagemin','compress','scripts','copy','watch']);
 
gulp.task('dist', ['less', 'jade','imagemin','compress','scripts','copy']);




