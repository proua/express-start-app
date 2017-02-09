const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const vinylPaths = require('vinyl-paths');
const shell = require('gulp-shell');
const runSequence = require('run-sequence');

const gulpTslint = require("gulp-tslint");
const tslint = require("tslint");

gulp.task('clean:js', (cb) => {
    return gulp.src([ 'src/**/*.js', 'src/**/*.js.map' ])
        .pipe(vinylPaths(del));
}); 

gulp.task('ts:compile', () => {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());

    const stream = tsResult.js
        .pipe(sourcemaps.write('./')) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('dist/'));

    return stream;
});

gulp.task('ts-lint', function() {
    const program = tslint.Linter.createProgram("./tsconfig.json");
    gulp.src([ 'src/**/*.ts', '!**/*.d.ts', '!node_modules/**' ])
        .pipe(gulpTslint({
            program,
            configuration: './tslint.json',
            formatter: "verbose"
        })
        .on('error', (error) => {
            console.log(error.toString());
        })
    );
});

gulp.task('npm', shell.task('npm run dev'));

gulp.task('default', () => {
    runSequence('ts:compile', 'watch');
});

gulp.task('watch', [ 'ts:compile' ], () => {
    gulp.watch('**/*.ts', [ 'ts:compile' ]);
});

