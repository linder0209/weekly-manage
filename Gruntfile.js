'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var path = require('path');
var fs = require('fs');

module.exports = function (grunt) {

  /* eslint-disable global-require */
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    express: 'grunt-express-server'
  });

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist',
    server: 'server',
    publish: 'publish',
    webapp: 'dist/webapp'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:eshint'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:eshint', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'postcss']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      express: {
        files: ['app.js', '<%= yeoman.server %>/**/*.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      },
      less: {
        files: ['<%= yeoman.app %>/less/{,*/}*.less'],
        tasks: ['less:develop']
      }
    },

    // express 启动任务
    express: {
      options: {
        port: 9001,
        livereload: 35729
      },
      dev: {
        options: {
          open: true,
          script: './bin/weekly-manage.js'
        }
      }
    },

    // 把less 转换为 css 任务
    less: {
      options: {
        //compress: true,// 是否压缩css
        //strictMath: true,
        relativeUrls: true,//生成相对url链接
        paths: ['<%= yeoman.app %>/']
      },
      develop: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/less',
          src: ['*.less'],
          ext: '.css',
          dest: '<%= yeoman.app %>/styles'
        }]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    eslint: {
      options: {
        configFile: 'D:/gitworkspace/eslint-config/es5/.eslintrc'
      },
      target: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*',
            '!<%= yeoman.dist %>/node_modules/**'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: ['last 1 version']})
        ]
      },
      server: {
        options: {
          map: true
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath: /\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi
            },
            replace: {
              js: '\'{{filePath}}\','
            }
          }
        }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.webapp %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.webapp %>/{,*/}*.html'],
      css: ['<%= yeoman.webapp %>/styles/{,*/}*.css'],
      js: ['<%= yeoman.webapp %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.webapp %>',
          '<%= yeoman.webapp %>/images',
          '<%= yeoman.webapp %>/styles'
        ],
        patterns: {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.webapp %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.webapp %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.webapp %>',
          src: ['*.html'],
          dest: '<%= yeoman.webapp %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'weeklyManageApp',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= yeoman.app %>',
        src: 'views/{,*/}*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.webapp %>',
          src: [
            '*.{ico,png,txt}',
            '*.html',
            'views/{,*/}*.html',
            'errors/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.webapp %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%= yeoman.app %>/bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.webapp %>'
        }, {
          expand: true,
          cwd: './',
          dest: '<%= yeoman.dist %>',
          src: [
            '<%= yeoman.server %>/**',
            '!<%= yeoman.server %>/data/**'
          ]
        }, {
          expand: true,
          cwd: '<%= yeoman.publish %>',
          dest: '<%= yeoman.dist %>',
          src: ['**']
        }, {
          expand: true,
          cwd: 'bin',
          dest: '<%= yeoman.dist %>/bin',
          src: ['**']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },

    /**
     * 替换文件中的内容
     * 默认会替换@@开头指定的内容，我们可以用option prefix 来改变，也可以用 usePrefix 禁用替换@@开头的内容，而设为替换任意指定的内容
     * 支持正则表达式
     * 这里顺便说一下参数 expand: true, flatten: true,
     * expand 表示展开，flatten设为false表示按照源文件的目录结构copy，设为true会把所有文件copy到一个文件夹下
     */
    replace: {
      app: {
        options: {
          usePrefix: false,// Default: true And  prefix Default: @@
          patterns: [
            {
              match: 'environment = \'development\'',
              replacement: 'environment = \'production\''
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['app.js'], dest: 'dist/'}
        ]
      }
    },

    /**
     * 压缩server js
     **/
    uglify: {
      server: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>/server',
            src: '**/*.js',
            dest: '<%= yeoman.dist %>/server'
          }
        ]
      }
    }
  });

  //创建临时数据文件
  grunt.registerTask('createData', function () {
    var rootPath = path.resolve(__dirname, appConfig.dist);
    /*eslint-disable no-sync*/
    fs.mkdirSync(rootPath + '/server/data');
    fs.mkdirSync(rootPath + '/server/data/weekly');
    fs.writeFileSync(rootPath + '/server/data/weekly-records.json', '', 'utf-8');
  });

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'express:dev']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'less:develop',//把less转换为css
      'concurrent:server',
      'postcss:server',
      'express:dev',// 启动 express
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'postcss',
    'express:dev',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    //'wiredep',
    'less:develop',//把less转换为css
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    //'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'replace:app',//替换文件
    'htmlmin',
    'uglify:server',// 压缩 server文件
    'createData'
  ]);

  grunt.registerTask('default', [
    'newer:eslint',
    'test',
    'build'
  ]);
};
