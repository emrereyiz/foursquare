
module.exports = function(grunt) {
  require('jit-grunt')(grunt);
  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          "_assets/css/main.css": "_assets/css/less/all.less"
        }
      }
    },
  	concat: {
	    options: {
	      separator: ';',
	    },
	    dist: {
	      src: ['_assets/js/core/jquery-3.2.1.min.js', '_assets/js/plugin/highcharts.js', '_assets/js/custom/map.js', '_assets/js/custom/project.js'],
	      dest: '_assets/js/main.js',
	    },
  	},
    watch: {
      styles: {
        files: ['_assets/**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: true
        }
      },
      script: {
        files: ['_assets/**/*.js'],
        tasks: ['concat'],
        options: {
          nospawn: true
        }
      },
    }
  });

  grunt.registerTask('default', ['less', 'concat', 'watch']);

};