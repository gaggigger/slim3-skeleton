var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('scripts', function() {
	console.log("generated new '/public/js/main.js'");
	return gulp.src(['app.js', './modules/**/*.js'])
		.pipe(concat('main.js'))
		// uglify not working
		//.pipe(rename({suffix: '.min'}))
		//.pipe(uglify())
		.pipe(gulp.dest('./js'));
});

gulp.task('watch', function() {
	gulp.watch(['app.js', './modules/**/*.js'], ['scripts']);
});

// default task
gulp.task('default', ['scripts', 'watch']);
