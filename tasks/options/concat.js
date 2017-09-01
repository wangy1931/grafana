module.exports = function(config) {
  "use strict";

  return {
    cssDark: {
      src: [
        '<%= genDir %>/vendor/css/timepicker.css',
        '<%= genDir %>/vendor/css/spectrum.css',
        '<%= genDir %>/css/grafana.dark.css',
        '<%= genDir %>/vendor/css/font-awesome.min.css',
        '<%= genDir %>/vendor/css/bootstrap-responsive.min.css',
        '<%= genDir %>/vendor/css/iconfont.css',
        '<%= genDir %>/vendor/css/quill.snow.css',
        '<%= genDir %>/vendor/css/quill.bubble.css',
      ],
      dest: '<%= genDir %>/css/grafana.dark.min.css'
    },

    cssLight: {
      src: [
        '<%= genDir %>/vendor/css/timepicker.css',
        '<%= genDir %>/vendor/css/spectrum.css',
        '<%= genDir %>/css/grafana.light.css',
        '<%= genDir %>/vendor/css/font-awesome.min.css',
        '<%= genDir %>/vendor/css/nouislider.min.css',
        '<%= genDir %>/vendor/css/bootstrap-responsive.min.css',
        '<%= genDir %>/vendor/css/iconfont.css',
        '<%= genDir %>/vendor/css/quill.snow.css',
        '<%= genDir %>/vendor/css/quill.bubble.css',
      ],
      dest: '<%= genDir %>/css/grafana.light.min.css'
    },

    cssFonts: {
      src: [ '<%= genDir %>/css/fonts.css' ],
      dest: '<%= genDir %>/css/fonts.min.css'
    },

    js_base: {
      src: [
        '<%= genDir %>/vendor/npm/es6-shim/es6-shim.js',
        '<%= genDir %>/vendor/npm/es6-promise/dist/es6-promise.js',
        '<%= genDir %>/vendor/npm/systemjs/dist/system-polyfills.js',
        '<%= genDir %>/vendor/npm/systemjs/dist/system.js',
        '<%= genDir %>/app/system.conf.js', 
      ],
      dest: '<%= genDir %>/app/base.js'
    },

    js: {
      src: [
        '<%= genDir %>/app/boot.js',
      ],
      dest: '<%= genDir %>/app/boot.js'
    },

    bundle_and_boot: {
      src: [
        '<%= genDir %>/app/app_bundle.js',
        '<%= genDir %>/app/boot.js',
      ],
      dest: '<%= genDir %>/app/boot.js'
    },
  };
};
