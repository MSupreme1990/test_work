const path = require('path');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const flexbugs = require('postcss-flexbugs-fixes');
const csso = require('postcss-csso');
const data = require('gulp-data');
const browserSync = require('browser-sync').create();
const flatten = require('gulp-flatten');
const fs = require('fs');
const tildeImporter = require('node-sass-tilde-importer');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const nunjucks = require('gulp-nunjucks');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');

let paths = {
    paths: {
        templates: [
            '!./templates/base.html' ,
            './templates/**/*.html'
        ],
        images: './src/images/**/*{.jpg,.png,.svg}',
        fonts: './src/fonts/**/*{.eot,.otf,.woff,.woff2,.ttf,.svg}',
        css: './src/css/**/*.scss',
        doc: './src/doc/**/*.pdf'
    },
    dst: {
        build: './build',
        templates: './build',
        css: './build/css',
        images: './build/images',
        fonts: './build/fonts',
        doc: './build/doc'
    }
};

gulp.task('fonts', () => {
    return gulp.src(paths.paths.fonts)
        .pipe(flatten())
        .pipe(gulp.dest(paths.dst.fonts));
});

gulp.task('doc', () => {
    return gulp.src(paths.paths.doc)
        .pipe(gulp.dest(paths.dst.doc))
        .pipe(browserSync.stream());
});

gulp.task('images', () => {
    return gulp.src(paths.paths.images)
        .pipe(gulp.dest(paths.dst.images))
        .pipe(browserSync.stream());
});

gulp.task('scss', () => {
    return gulp.src(paths.paths.css)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ importer: tildeImporter }).on('error', console.log))
        .pipe(postcss([
            flexbugs(),
            autoprefixer({
                browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
            }),
            csso(),
        ]))
        .pipe(sourcemaps.write('.', { sourceRoot: '/' }))
        .pipe(gulp.dest(paths.dst.css))
        .pipe(browserSync.stream());
});

gulp.task('css', gulp.series('fonts', 'scss'));

gulp.task('clean', cb => {
    return del(paths.dst.build, cb);
});

gulp.task('templates', () => {
    return gulp.src(paths.paths.templates)
        .pipe(plumber())
        .pipe(data(file => {
            const dataFile = require.resolve('./data.json');
            delete require.cache[dataFile];
            return require(dataFile);
        }))
        .pipe(nunjucks.compile())
        .pipe(gulp.dest(paths.dst.templates));
});

gulp.task('serve', cb => {
    browserSync.init({
        server: {
            baseDir: path.join(__dirname, "build"),
            index: "index.html",
            // Static routes
            routes: {
                "/bower_components": "bower_components"
            }
        },
        open: false,
    });
    cb();
});

gulp.task('reload', cb => {
    browserSync.reload();
    cb();
});

gulp.task('watch', () => {
    gulp.watch('./build/js/**/*.js', gulp.series('reload'));
    gulp.watch(paths.paths.images, gulp.series('images'));
    gulp.watch(paths.paths.css, gulp.series('css'));
    gulp.watch([
        './templates/**/*.html',
        './data.json',
    ], gulp.series('templates', 'reload'));
});

gulp.task('develop', gulp.parallel('templates', 'serve', 'watch'));

gulp.task('build', gulp.parallel('templates', 'css', 'images', 'doc'));
