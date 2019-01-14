var npmDir           = './node_modules',
    main_src         = './app',
    dirHtml_src      = './app',
    dirStyles_src    = main_src+'/styles',
    dirScripts_src   = main_src+'/scripts',
    dirImg_src       = main_src+'/images',
    main_dist        = './dist',
    dirHtml_dist     = main_dist,
    dirStyles_dist   = main_dist+'/css',
    dirScripts_dist  = main_dist+'/js',
    dirImg_dist      = main_dist+'/images',
    dirFonts_dist    = main_dist+'/fonts';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync   = require('browser-sync'),
    htmlmin       = require('gulp-htmlmin'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    cssnano       = require('gulp-cssnano'),
    rename        = require('gulp-rename'),
    autoprefixer  = require('gulp-autoprefixer'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    cache         = require('gulp-cache'),
    nunjucks      = require('gulp-nunjucks'),
    nunjucksRender= require('gulp-nunjucks-render'),
    plumber = require('gulp-plumber');



/**************************Компиляция SASS*************************************/
gulp.task('sass', function() {
    return gulp.src(dirStyles_src + '/main.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer( ['last 25 versions', 'ie 8', 'ie 7'], { cascad: true }))
        .pipe(gulp.dest(dirStyles_dist))
        .pipe(browserSync.reload({stream: true}))
});



/**************************************Сжатие html******************************/
gulp.task('minify_html', function() {
    return gulp.src(dirHtml_src+'/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(plumber())
        .pipe(gulp.dest(main_dist));
});

/***********************************template html******************************/
gulp.task('nunjucks-render', function () {
    return gulp.src(dirHtml_src + '/*.html')
        .pipe(nunjucksRender({
            path: [dirHtml_src] // String or Array
        }))
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest(dirHtml_dist));
});

/**************************Сжатие CSS*******************************************/
gulp.task('css-main', ['sass'], function(){
  return gulp.src(dirStyles_dist+'/main.css')
    .pipe(plumber())
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dirStyles_dist));
});

/**************************Browser Sync****************************************/
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: main_dist
    },
    notify:false
  });

  gulp.watch([dirStyles_src+'/**/*.scss'], ['sass']).on("change", browserSync.reload);
  gulp.watch([dirScripts_src+'/**/*.js']) .on("change", browserSync.reload); 
  gulp.watch([dirHtml_src+ "/**/*.html"]).on("change", browserSync.reload);
});


gulp.task('clean', function(){
    return del.sync(main_dist);
});

gulp.task('cleare', function(){
    return cache.clearAll();
});


/**************************main JS*******************************************/
gulp.task('scripts_main', function() {
    return gulp.src(dirScripts_src+'/*.js')
        .pipe(plumber())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dirScripts_dist));
});


/**************************Уменьшение изображений******************************/
gulp.task('img', function(){
    return gulp.src(dirImg_src+'/**/*')
        .pipe(plumber())
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(dirImg_dist));
});



/*************************************WATCH************************************/
gulp.task('watch', ['browser-sync', 'nunjucks-render', 'sass', 'css-main', 'scripts_main', 'img'], function() {
  gulp.watch([dirStyles_src+'/**/*.scss'], ['sass']);
  gulp.watch([dirScripts_src+'/**/*.js'], ["scripts_main"]);
  gulp.watch([dirImg_src], ["img"]);
  gulp.watch([dirHtml_src + '/**/*.html'],['nunjucks-render']);
});

/*************************************СБОРКА***********************************/
gulp.task('build', ['clean', 'minify_html', 'nunjucks-render', 'css-main', 'scripts_main', 'img']);
