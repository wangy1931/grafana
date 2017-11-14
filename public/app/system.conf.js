System.config({
  defaultJSExtenions: true,
  baseURL: 'public',
  paths: {
    'remarkable':               'vendor/npm/remarkable/dist/remarkable.js',
    'tether':                   'vendor/npm/tether/dist/js/tether.js',
    'tether-drop':              'vendor/npm/tether-drop/dist/js/drop.js',
    'moment':                   'vendor/moment.js',
    "jquery":                   "vendor/jquery/dist/jquery.js",
    'lodash-src':               'vendor/lodash.js',
    "lodash":                   'app/core/lodash_extended.js',
    "angular":                  "vendor/angular/angular.js",
    "bootstrap":                "vendor/bootstrap/bootstrap.js",
    'angular-route':            'vendor/angular-route/angular-route.js',
    'angular-sanitize':         'vendor/angular-sanitize/angular-sanitize.js',
    "angular-ui":               "vendor/angular-ui/ui-bootstrap-tpls.js",
    "angular-strap":            "vendor/angular-other/angular-strap.js",
    "angular-strap.tpl":        "vendor/angular-other/angular-strap.tpl",
    "angular-strap-old":        "vendor/angular-other/angular-strap-old",
    "angular-dragdrop":         "vendor/angular-native-dragdrop/draganddrop.js",
    "angular-bindonce":         "vendor/angular-bindonce/bindonce.js",
    "angular-animate":          "vendor/angular-other/angular-animate.js",
    "spectrum":                 "vendor/spectrum.js",
    "bootstrap-tagsinput":      "vendor/tagsinput/bootstrap-tagsinput.js",
    "jquery.flot":              "vendor/flot/jquery.flot",
    "jquery.flot.pie":          "vendor/flot/jquery.flot.pie",
    "jquery.flot.selection":    "vendor/flot/jquery.flot.selection",
    "jquery.flot.stack":        "vendor/flot/jquery.flot.stack",
    'eventemitter3':            'vendor/npm/eventemitter3/index.js',
    "jquery.flot.stackpercent": "vendor/flot/jquery.flot.stackpercent",
    "jquery.flot.time":         "vendor/flot/jquery.flot.time",
    "jquery.flot.crosshair":    "vendor/flot/jquery.flot.crosshair",
    "jquery.flot.fillbelow":    "vendor/flot/jquery.flot.fillbelow",
    'jquery.flot.fillbetween':  'vendor/flot/jquery.flot.fillbetween',
    "jquery.flot.navigate":     "vendor/flot/jquery.flot.navigate",

    "highlight":                'vendor/angular-other/highlight',
    "slider":                   'vendor/angular-other/nouislider.min',
    'fullcalendar':             'vendor/fullcalendar/dist/fullcalendar.min',
    'ui.calendar':              'vendor/angular-ui-calendar/src/calendar',
    'zh-cn':                    'vendor/fullcalendar/dist/zh-cn',
    'bootstrap-table':          'vendor/angular-other/bootstrap-table',
    'jsPlumbToolkit':           'vendor/jsPlumb/jsPlumbToolkit',

    "jquery.flot.gauge":        "vendor/flot/jquery.flot.gauge",
    'quill':                    'vendor/quill/quill.min',
    'ng-quill':                 'vendor/quill/ng-quill',
    'jsdiff':                   'vendor/jsdiff/index',
    'd3':                       'vendor/d3/d3.min',
    'd3.tip':                   'vendor/d3/d3.tip',
    'd3.graph':                 'vendor/d3/d3.relationshipgraph',
    'ng-table':                 'vendor/angular-other/ng-table.min'
  },

  packages: {
    app: {
      defaultExtension: 'js',
    },
    vendor: {
      defaultExtension: 'js',
    },
    plugins: {
      defaultExtension: 'js',
    },
    test: {
      defaultExtension: 'js',
    },
  },

  map: {
    text: 'vendor/plugin-text/text.js',
    css: 'app/core/utils/css_loader.js'
  },

  meta: {
    'vendor/angular/angular.js': {
      format: 'global',
      deps: ['jquery'],
      exports: 'angular',
    },
    'vendor/npm/eventemitter3/index.js': {
      format: 'cjs',
      exports: 'EventEmitter'
    },
    'vendor/jsPlumb/jsPlumbToolkit.js': {
      build: false
    },
    'vendor/quill/quill.min.js': {
      build: false
    },
    'vendor/quill/ng-quill.js': {
      build: false
    }
  },

  bundles: {
    // 'public_gen/app/3party.js': ['public_gen/app/3party.js']
    // '33party.js': ['vendor/jquery/dist/jquery.js', 'vendor/moment.js', 'app/core/lodash_extended.js', 'vendor/lodash.js', 'vendor/bootstrap/bootstrap.js']
  }
});
