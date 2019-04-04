/// <binding BeforeBuild='portal_iclrsScripts,portal_iclrsCss' />
"use strict";

//var files = [
//    "./typeScript/gulpDef.ts"
//];
//files.forEach(function (file) { eval(require("typescript").transpile(require("fs").readFileSync(file).toString())) });

var gulp = require("gulp");
var gutil = require("gulp-util");
var path = require("path");
var fs = require("fs");
//var gulpTypings = require("gulp-typings");
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var concat = require("gulp-concat");
var del = require('del');
var debug = require('gulp-debug');
var typescript = require('gulp-typescript');
var merge2 = require('merge2');
var mergeJson = require('gulp-extend');
var fileExists = require("file-exists");
var minify = require('gulp-minify');
var concatCss = require('gulp-concat-css');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var useref = require('gulp-useref');
var exec = require('child_process').exec;

var folders = {
};

var paths = {
    
};

var moveScriptsTasks = { reg: [], withReturn: [] };

function gulpTask(name, func, requires) {
    requires = requires || [];
    if (!(requires instanceof Array)) {
        requires = [requires];
    }
    gulp.task(name, regReq, func);
}

gulpTask("installTypings", function () {
    return gulp.src("./typings.json")
        .pipe(gulpTypings()); //will install all typingsfiles in pipeline. 
});

gulp.task('default', ['watch_portal'], function () {
    return gutil.log('Gulp is running...');
});

function mergeScripts() {
    
}