var gulp = require('gulp');
var eslint = require('gulp-eslint');
var nodemon = require('gulp-nodemon');

gulp.task('default', function() {
  gulp
    .src("node_modules/materialize-css/dist/**/*")
    .pipe(gulp.dest("public"));

  gulp
    .src(["node_modules/jquery/dist/*", "node_modules/riot/riot+compiler.min.js"])
    .pipe(gulp.dest("public/js"));

  gulp
    .src("node_modules/material-design-icons-iconfont/dist/**/*")
    .pipe(gulp.dest("public/icons"));

  gulp
    .src(['server.js', 'controllers/*.js'])
    .pipe(eslint({
      envs: ['node', 'es6'],
      extends: 'eslint:recommended',
      rules: {
        "eqeqeq": 2
      }
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('serve', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html css',
    env: { 
      'USER_APP_PORT': '9999',
      'LDAP_URL': 'ldap://user.pocci.test',
      'LDAP_BASE_DN': 'dc=example,dc=com',
    }
  })
})
