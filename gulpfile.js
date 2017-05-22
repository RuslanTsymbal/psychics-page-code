var gulp = require("gulp");
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');

gulp.task('default', ['html', 'style', 'images', 'script']);

gulp.task('html', function () {
    return gulp.src('app/index.html')
        .pipe(gulp.dest('./'))
});

gulp.task('style', function () {
    return gulp.src('app/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('images', function () {
    return gulp.src('app/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant({quality: '20-25', speed: 5})]
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('script', function(){
    gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        },
        notify: false
    });
});

gulp.task('watch', ['browser-sync','html'], function () {
    gulp.watch('app/styles/*.scss', ['style']);
    gulp.watch('app/index.html', ['html', browserSync.reload]);
    gulp.watch('app/js/*.js', ['script', browserSync.reload]);
});
