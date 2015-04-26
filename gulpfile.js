/*
 * Mithril.js Starter Kit
 * Copyright (c) 2014 Phil Toms (@philtoms)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';
require('coffee-script/register');
/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.

  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/

var requireDir = require('require-dir');

// require('./gulpfile.coffee');

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md

var gulp = require('gulp');
var config = require('./gulp-config.js');
var myconfig = require('./myprivateconfig.js');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var merge = require('merge-stream');
var merge2 = require('merge2');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var extend = require('extend');
var fs = require('fs');
var url = require('url');
var argv = require('minimist')(process.argv.slice(2));
var rsync = require('rsyncwrapper').rsync;
// var nib = require('nib');

// Settings
// var DEST = './build'; // The build output folder
var VERSION = config.version;
var RELEASE = !!argv.release; // Minimize and optimize during a build?
var DEST = RELEASE ? config.dist : config.build; // The build output folder
var VERSION_DIR = DEST + '/' + config.version;
var AUTOPREFIXER_BROWSERS = [ // https://github.com/ai/autoprefixer
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var src = {};
var watch = false;
var pkgs = (function() {
  var pkgs = {};

  var map = function(source) {
    for (var key in source) {
      pkgs[key.replace(/[^a-z0-9]/gi, '')] = source[key].substring(1);
    }
  };
  map(require('./package.json').dependencies);
  return pkgs;
}());

// handle errors
// var handleErrors = function() {
  // var args = Array.prototype.slice.call(arguments);
  // $.util.log('Error: ' + args);
  // return;
  // Send error to notification center with gulp-notify
  // $.notify.onError({
    // title: 'Compile Error',
    // message: '<%= error.message %>'
  // }).apply(this, args);
  // // Keep gulp from hanging on this task
  // this.emit('end');
// };

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', {
  recurse: true
});

// The default task
gulp.task('default', ['serve']);

// Clean up
gulp.task('clean', del.bind(null, [DEST]));

// 3rd party libraries
// gulp.task('vendor', function() {
  // src.vendor = [
    // 'bower_components/todomvc-common/base.{js,css}',
    // 'bower_components/todomvc-common/bg.png'
  // ];
  // return merge(
    // gulp.src(src.vendor)
      // .pipe(gulp.dest(VERSION_DIR + '/vendor')),
    // gulp.src('./node_modules/bootstrap/dist/fonts/**')
      // .pipe(gulp.dest(VERSION_DIR + '/fonts'))
  // );
// });

// Static files
gulp.task('assets', function() {
  src.assets = [
    'src/assets/**'
  ];
  return gulp.src(src.assets)
    .pipe($.changed(VERSION_DIR + '/assets'))
    .pipe(gulp.dest(VERSION_DIR + '/assets'))
    .pipe($.size({
      title: 'assets'
    }));
});

// Images
gulp.task('images', function() {
  src.images = 'src/images/**';
  return gulp.src(src.images)
    .pipe($.changed(VERSION_DIR + '/images'))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(VERSION_DIR + '/images'))
    .pipe($.size({
      title: 'images'
    }));
});

// HTML pages
    // .pipe($.changed(DEST))
gulp.task('pages', ['jade'], function() {
  src.pages = ['src/pages/index.html', 'src/pages/404.html'];
  return gulp.src(src.pages)
    .pipe($.replace('bundle.js', VERSION + '/bundle.js'))
    .pipe($.replace('myapp', VERSION))
    .pipe($.replace('appRootUrl', myconfig.appRootUrl))
    .pipe($.replace('myGoogleAnalyticsId', myconfig.myGoogleApiKey))
    .pipe($.replace('myGoogleListedName', myconfig.myGoogleListedName))
    .pipe($.replace('myStreetAddress', myconfig.myStreetAddress))
    .pipe($.replace('myCity', myconfig.myCity))
    .pipe($.replace('myState', myconfig.myState))
    .pipe($.replace('myPhoneNumber', myconfig.myPhoneNumber))
    .pipe($.replace('myLogoUrl', myconfig.myLogoUrl))
    .pipe($.replace('myBusinessUrl', myconfig.myBusinessUrl))
    .pipe($.if(!RELEASE, $.replace('.min.js', '.js')))
    .pipe($.if(RELEASE, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true
    }), $.jsbeautifier()))
    .pipe(gulp.dest(DEST))
    .pipe($.size({
      title: 'pages'
    }));
});

// // CSS style sheets
// gulp.task('styles', function() {
// src.styles = 'src/styles/**/*.{css,less}';
// return gulp.src('src/styles/app.less')
// .pipe($.plumber())
// .pipe($.less({
// sourceMap: !RELEASE,
// sourceMapBasepath: __dirname
// }))
// .on('error', console.error.bind(console))
// .pipe($.autoprefixer({
// browsers: AUTOPREFIXER_BROWSERS
// }))
// .pipe($.if(RELEASE, $.minifyCss()))
// .pipe(gulp.dest(VERSION_DIR + '/css'))
// .pipe($.size({
// title: 'styles'
// }));
// });

// Stylus
// gulp.task('styles', function(cb) {
  // gulp.src(config.styles)
    // .pipe($.sourcemaps.init())
    // .pipe($.stylus({
      // use: nib(),
      // compress: false
    // }))
    // .pipe($.sourcemaps.write())
    // .on('error', handleErrors)
    // .pipe(gulp.dest(VERSION_DIR));
  // cb(null);
// });

// Bundle
gulp.task('bundle', function(cb) {
  var options = require(config.webpack.configfile)(RELEASE, watch);
  gulp.src('./src/app.coffee')
    .pipe($.webpack(options))
    .pipe(gulp.dest(VERSION_DIR));
  cb(null);
});

// Build the app from source code
gulp.task('build', ['clean'], function(cb) {
  runSequence(['assets', 'images', 'bundle', 'pages'], cb);
});

// Launch a lightweight HTTP Server
gulp.task('serve', function(cb) {

  watch = true;
  global.isWatching = true;

  runSequence('build', function() {
    browserSync({
      browser: 'Google Chrome Canary',
      notify: false,
      // Customize the BrowserSync console logging prefix
      logPrefix: VERSION.toUpperCase(),
      port: 3031,
      // Run as an https by uncommenting 'https: true'
      // Note: this uses an unsigned certificate which on first access
      //       will present a certificate warning in the browser.
      // https: true,
      server: {
        baseDir: DEST,
        // Allow web page requests without .html file extension in URLs
        middleware: function(req, res, cb) {
          var uri = url.parse(req.url);
          if (uri.pathname.length > 1 &&
            path.extname(uri.pathname) === '' &&
            fs.existsSync(DEST + uri.pathname + '.html')) {
            req.url = uri.pathname + '.html' + (uri.search || '');
          }
          cb();
        }
      }
    });

    // gulp.watch(src.vendor, ['vendor']);
    gulp.watch(src.assets, ['assets']);
    gulp.watch(src.images, ['images']);
    gulp.watch('./src/pages/jade/**/*.jade', ['jade']);
    gulp.watch('./src/pages/**/*.html', ['pages']);
    gulp.watch('./src/styles/**/*.*', ['bundle']);
    gulp.watch('./src/**/*.coffee', ['bundle']);

    gulp.watch(DEST + '/**/*.*', function(file) {
      browserSync.reload(path.relative(__dirname, file.path));
    });
    gulp.watch('gulpfile.js', ['build'], function(file) {
      browserSync.reload(path.relative(__dirname, file.path));
    });
    gulp.watch('gulp-config.js', ['build'], function(file) {
      browserSync.reload(path.relative(__dirname, file.path));
    });
    gulp.watch('myprivateconfig.js', ['build'], function(file) {
      browserSync.reload(path.relative(__dirname, file.path));
    });
    gulp.watch('gulp/**/*.*', ['build'], function(file) {
      browserSync.reload(path.relative(__dirname, file.path));
    });
    gulp.watch('./mithril-palantir.js', ['build'], function(file) {
      browserSync.reload(path.relative(__dirname, file.path));
    });

    cb();
  });
});

// run jest tests
// gulp.task('jest', function () {
//     return gulp.src('src/**/__tests__').pipe($.jest({
//         unmockedModulePathPatterns: [
//         ],
//         testDirectoryName: "src",
//         testPathIgnorePatterns: [
//             "node_modules",
//             "spec/support"
//         ],
//         moduleFileExtensions: [
//             "js",
//             "json",
//             "msx"
//         ]
//     }));
// });

var jest = require('jest-cli');
var chalk = require('chalk');
gulp.task('jest', function(callback) {
  var onComplete = function(result) {
    // if (result) {
    // } else {
    //   console.log(chalk.bgYellow('!!! Jest tests failed! You should fix them soon. !!!'));
    // }
    callback();
  };
  jest.runCLI({}, __dirname, onComplete);
});

gulp.task('tdd', function() {
  gulp.watch('src/**/*.js', ['jest']);
});

gulp.task('bdd', function() {
  gulp.watch('src/**/*.js', ['jest']);
});

// Deploy to GitHub Pages
gulp.task('deploy', function() {

  // Remove temp folder
  if (argv.clean) {
    var os = require('os');
    var path = require('path');
    var repoPath = path.join(os.tmpdir(), 'tmpRepo');
    $.util.log('Delete ' + $.util.colors.magenta(repoPath));
    del.sync(repoPath, {
      force: true
    });
  }

  return gulp.src(DEST + '/**/*')
    .pipe($.if('**/robots.txt', !argv.production ? $.replace('Disallow:', 'Disallow: /') : $.util.noop()))
    .pipe($.ghPages({
      remoteUrl: 'https://github.com/{name}/{name}.github.io.git',
      branch: 'master'
    }));
});

// rsync to server
gulp.task('rsync', function(cb) {
  if (!RELEASE) $.util.log($.util.colors.yellow('DRY RUN. add --release to upload to server'));
  rsync(
    { dryRun: !RELEASE,
      ssh: true,
      src: config.rsync.src,
      dest: config.rsync.dest,
      recursive: true,
      args: ['--verbose']
    },
    function(error, stdout, stderr, cmd) {
      $.util.log(stdout);
    }
  );
  cb(null);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info
  key:myconfig.myGoogleApiKey,
  url: myconfig.appRootUrl + '/index.html',
  strategy: 'mobile'
}));
var WebPageTest = require('webpagetest');
gulp.task('webpagetest', function() {
  var wpt = new WebPageTest('www.webpagetest.org', myconfig.myWebPageTestApiKey);
  wpt.runTest(myconfig.appRootUrl + '/index.html', function(err, data) {
    $.util.log($.util.colors.yellow('WebPageTest Results: '), err || data.data.userUrl);
  });
});
