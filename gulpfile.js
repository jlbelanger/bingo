const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const foreach = require('gulp-foreach');
const livereload = require('gulp-livereload');
const mergeStream = require('merge-stream');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass')(require('node-sass'));
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const twig = require('gulp-twig');

const config = {
	meta: {
		title: 'Font Bingo',
		description: '',
	},
	css: {
		bundles: [
			{
				src: ['scss/*.scss'],
				dest: 'build/assets/css',
			},
		],
		dest: 'build/assets/css',
		watch: ['node_modules/**/*.scss', 'scss/*.scss', 'scss/**/*.scss'],
	},
	files: {
		bundles: [
			{
				src: ['public/**/*', 'public/**/.*'],
				dest: 'build',
			},
		],
		watch: ['public/**/*', 'public/**/.*'],
	},
	html: {
		compile: ['src/**/*.html'],
		watch: [
			'src/**/*.html',
			'src/**/*.html.twig',
		],
		dest: 'build',
	},
	js: {
		bundles: [
			{
				src: ['js/*.js', 'js/**/*.js'],
				dest_folder: 'build/assets/js',
				dest_file: 'functions.min.js',
			},
		],
		dest: 'build/assets/js',
		watch: ['node_modules/**/*.js', 'js/*.js', 'js/**/*.js'],
	},
};

function css() {
	return mergeStream(
		config.css.bundles.map((obj) => (
			gulp.src(obj.src)
				.pipe(sass())
				.pipe(rename({ suffix: '.min' }))
				.pipe(postcss([autoprefixer(), cssnano()]))
				.pipe(gulp.dest(obj.dest))
				.pipe(livereload())
		)),
	);
}

function files() {
	return mergeStream(
		config.files.bundles.map((obj) => (
			gulp.src(obj.src)
				.pipe(gulp.dest(obj.dest))
				.pipe(livereload())
		)),
	);
}

function html() {
	return gulp.src(config.html.compile)
		.pipe(foreach(function (stream, file) {
			const name = file.path.replace(/^.+\/src\//, '');
			return stream.pipe(twig({
				filters: [
					{
						name: 'metaDescription',
						func: function (str) {
							return str || config.meta.description;
						},
					},
					{
						name: 'metaTitle',
						func: function (str) {
							return str ? str.replace(/<[^>]+>/g, '') + ' | ' + config.meta.title : config.meta.title;
						},
					},
				],
				functions: [
					{
						name: 'activeClass',
						func: function (path) {
							if (path[0] === '/') {
								return (('/' + name).indexOf(path) > -1) ? ' class="active"' : '';
							}
							return (path === name) ? ' class="active"' : '';
						},
					},
					{
						name: 'filenameClass',
						func: function () {
							return ' class="page-' + name.replace(/[^a-z0-9-]+/g, '-') + '"';
						},
					},
					{
						name: 'isActive',
						func: function (path) {
							return path === name;
						},
					},
				],
			}));
		}))
		.pipe(gulp.dest(config.html.dest))
		.pipe(livereload());
}

function js() {
	return mergeStream(
		config.js.bundles.map((obj) => (
			gulp.src(obj.src)
				.pipe(concat(obj.dest_file))
				.pipe(terser())
				.pipe(gulp.dest(obj.dest_folder))
				.pipe(livereload())
		)),
	);
}

gulp.task('default', () => {
	(gulp.parallel('css', 'files', 'html', 'js')());
	gulp.watch(config.css.watch, css);
	gulp.watch(config.files.watch, files);
	gulp.watch(config.html.watch, html);
	gulp.watch(config.js.watch, js);
	livereload.listen();
	gulp.watch([
		`${config.css.dest}/**/*.css`,
		`${config.html.dest}/**/*.html`,
		`${config.js.dest}/**/*.js`,
	]).on('change', livereload.changed);
});

gulp.task('css', () => css());
gulp.task('files', () => files());
gulp.task('html', () => html());
gulp.task('js', () => js());
