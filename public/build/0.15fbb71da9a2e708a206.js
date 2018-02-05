webpackJsonp([0],{

/***/ 1171:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(1180),
  __webpack_require__(1215),
  __webpack_require__(1182),
  __webpack_require__(1184),
  __webpack_require__(1187),
  __webpack_require__(1207),
  __webpack_require__(1213),
  __webpack_require__(1173),
  __webpack_require__(1216),
  __webpack_require__(1218),
  __webpack_require__(1219),
  __webpack_require__(1220),
  __webpack_require__(1221),
  __webpack_require__(1223),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1172:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImpressionsStore", function() { return ImpressionsStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "impressions", function() { return impressions; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_store__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_app_core_store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_app_core_config__);
///<reference path="../../headers/common.d.ts" />



var ImpressionsStore = /** @class */ (function () {
    function ImpressionsStore() {
    }
    ImpressionsStore.prototype.addDashboardImpression = function (dashboardId) {
        var impressionsKey = this.impressionKey(__WEBPACK_IMPORTED_MODULE_2_app_core_config___default.a);
        var impressions = [];
        if (__WEBPACK_IMPORTED_MODULE_0_app_core_store___default.a.exists(impressionsKey)) {
            impressions = JSON.parse(__WEBPACK_IMPORTED_MODULE_0_app_core_store___default.a.get(impressionsKey));
            if (!__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isArray(impressions)) {
                impressions = [];
            }
        }
        impressions = impressions.filter(function (imp) {
            return dashboardId !== imp;
        });
        impressions.unshift(dashboardId);
        if (impressions.length > 50) {
            impressions.pop();
        }
        __WEBPACK_IMPORTED_MODULE_0_app_core_store___default.a.set(impressionsKey, JSON.stringify(impressions));
    };
    ImpressionsStore.prototype.getDashboardOpened = function () {
        var impressions = __WEBPACK_IMPORTED_MODULE_0_app_core_store___default.a.get(this.impressionKey(__WEBPACK_IMPORTED_MODULE_2_app_core_config___default.a)) || "[]";
        impressions = JSON.parse(impressions);
        impressions = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.filter(impressions, function (el) {
            return __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isNumber(el);
        });
        return impressions;
    };
    ImpressionsStore.prototype.impressionKey = function (config) {
        return "dashboard_impressions-" + config.bootData.user.orgId;
    };
    return ImpressionsStore;
}());

var impressions = new ImpressionsStore();



/***/ }),

/***/ 1173:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(1174),
  __webpack_require__(1175),
  __webpack_require__(1176),
  __webpack_require__(456),
  __webpack_require__(1177),
  __webpack_require__(1178),
  __webpack_require__(1179),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1174:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(16),
  __webpack_require__(3),
  __webpack_require__(201),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, $, _, Tether) {
  'use strict';

  angular
    .module('grafana.directives')
    .directive('panelMenu', function($compile, linkSrv) {
      var linkTemplate =
          '<span class="panel-title drag-handle pointer">' +
            '<span class="panel-title-text drag-handle">{{ctrl.panel.title | interpolateTemplateVars:this}}</span>' +
            '<span class="panel-links-btn"><i class="fa fa-external-link"></i></span>' +
            '<span class="panel-time-info" ng-show="ctrl.timeInfo"><i class="fa fa-clock-o"></i> {{ctrl.timeInfo}}</span>' +
          '</span>';

      function createExternalLinkMenu(ctrl) {
        var template = '<div class="panel-menu small">';
        template += '<div class="panel-menu-row">';

        if (ctrl.panel.links) {
          _.each(ctrl.panel.links, function(link) {
            var info = linkSrv.getPanelLinkAnchorInfo(link, ctrl.panel.scopedVars);
            template += '<a class="panel-menu-link" href="' + info.href + '" target="' + info.target + '">' + info.title + '</a>';
          });
        }
        return template;
      }

      function createMenuTemplate(ctrl) {
        // debugger
        var template = '<div class="panel-right-menu drag-handle" ng-show="!ctrl.loading" ng-class="{panelError: ctrl.error}">';
        _.each(ctrl.getMenu(), function (item) {
          if (item.role === 'Editor' && !ctrl.dashboard.meta.canEdit) {
            return;
          }
          template += '<span class="';
          var className = 'panel-right-menu-item';
          if (item.hover) {
            className += ' ' + item.hover;
          }
          template += className + '"';
          template += ' ng-click="' + item.click + '" bs-tooltip="' + "'" + item.text + "'" + '" data-container="body">';
          template += '<i class="fa ' + item.icon + '"></i>';
          template += '</span>';
        });

        if (ctrl.checkMenu('list')) {
          template += '<div class="dropdown pull-right panel-right-menu-item">';
          template += '<a class="pointer" ng-click="hideTooltip($event)" data-placement="bottom" data-toggle="dropdown"><i class="fa fa-bars"></i></a>';
          template += '<ul class="dropdown-menu">';
          _.each(ctrl.getExtendedMenu(), function (item) {
            if (item.role === 'Editor' && !ctrl.dashboard.meta.canEdit) {
              return;
            }
            template += '<li><a class="pointer"';
            if (item.click) { template += ' ng-click="'+ item.click +'"'; }
            template += '>' + item.text + '</a></li>';
          });
          template += '</ul>';
          template += '</div>';
        }

        if (ctrl.panel.downsamples) {
          template += '<div class="dropdown pull-right panel-right-menu-item">';
          template += '<a class="pointer" ng-click="hideTooltip($event)" data-placement="bottom" data-toggle="dropdown"><i class="fa fa-arrow-circle-o-down"></i>{{ctrl.panel.downsample}}</a>';
          template += '<ul class="dropdown-menu">';
          _.each(ctrl.getDownsamplesMenu(), function (item) {
            template += '<li><a class="pointer"';
            if (item.click) { template += ' ng-click="'+ item.click +'"'; }
            template += '>' + item.text + '</a></li>';
          });
          template += '</ul>';
          template += '</div>';
        }
        template += '</div>';
        return template;
      }

      function getExtendedMenu(ctrl) {
        return ctrl.getExtendedMenu();
      }

      return {
        restrict: 'A',
        link: function($scope, elem) {
          var $link = $(linkTemplate);
          var $panelLinksBtn = $link.find(".panel-links-btn");
          var $panelContainer = elem.parents(".panel-container");
          var menuScope = null;
          var ctrl = $scope.ctrl;
          var timeout = null;
          var $menu = null;
          var teather;

          elem.append($link);

          $scope.$watchCollection('ctrl.panel.links', function(newValue) {
            var showIcon = (newValue ? newValue.length > 0 : false) && ctrl.panel.title !== '';
            $panelLinksBtn.toggle(showIcon);
          });

          function dismiss(time, force) {
            clearTimeout(timeout);
            timeout = null;

            if (time) {
              timeout = setTimeout(dismiss, time);
              return;
            }

            // if hovering or draging pospone close
            if (force !== true) {
              if ($menu.is(':hover') || $scope.ctrl.dashboard.$$panelDragging) {
                dismiss(2200);
                return;
              }
            }

            if (menuScope) {
              teather.destroy();
              $menu.unbind();
              $menu.remove();
              menuScope.$destroy();
              menuScope = null;
              $menu = null;
              $panelContainer.removeClass('panel-highlight');
            }
          }

          elem.append(createMenuTemplate(ctrl));
          $compile(elem.contents())($scope);
        }
      };
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1175:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
///<reference path="../../headers/common.d.ts" />


var module = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('grafana.directives');
var panelTemplate = "\n  <div class=\"panel-container\" ng-class=\"{'panel-transparent': ctrl.panel.transparent}\">\n    <div class=\"panel-header\">\n      <span class=\"panel-error small pointer\" ng-if=\"ctrl.error\" ng-click=\"ctrl.openInspector()\">\n        <span data-placement=\"top\" bs-tooltip=\"ctrl.error\" data-container=\"body\">\n          <i class=\"fa fa-exclamation-circle\"></i>\n        </span>\n      </span>\n\n      <span class=\"panel-loading\" ng-show=\"ctrl.loading\">\n        <i class=\"fa fa-spinner fa-spin\"></i>\n      </span>\n      <div class=\"panel-title-container drag-handle\" panel-menu></div>\n    </div>\n\n    <div class=\"panel-content\">\n      <ng-transclude></ng-transclude>\n    </div>\n    <panel-resizer></panel-resizer>\n    <div class=\"help-info\" ng-class=\"{true:'active'}[helpShow]\" ng-if=\"helpInfo.info\" ng-mouseleave=\"isShowInfo($event)\">\n      <div>\n        <h2>{{helpInfo.title}}</h2>\n        <div ng-bind-html=\"helpInfo.context\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"panel-full-edit\" ng-if=\"ctrl.editMode\">\n    <div class=\"tabbed-view tabbed-view--panel-edit\">\n      <div class=\"tabbed-view-header\">\n        <h2 class=\"tabbed-view-title\">\n          {{ctrl.pluginName}}\n        </h2>\n\n        <ul class=\"gf-tabs\">\n          <li class=\"gf-tabs-item\" ng-repeat=\"tab in ::ctrl.editorTabs\">\n            <a class=\"gf-tabs-link\" ng-click=\"ctrl.editorTabIndex = $index\" ng-class=\"{active: ctrl.editorTabIndex === $index}\">\n              {{::tab.title}}\n            </a>\n          </li>\n        </ul>\n\n        <button class=\"tabbed-view-close-btn\" ng-click=\"ctrl.exitFullscreen();\">\n          <i class=\"fa fa-remove\"></i>\n        </button>\n      </div>\n\n      <div class=\"tabbed-view-body\">\n        <div ng-repeat=\"tab in ctrl.editorTabs\" ng-if=\"ctrl.editorTabIndex === $index\">\n          <panel-editor-tab editor-tab=\"tab\" ctrl=\"ctrl\" index=\"$index\"></panel-editor-tab>\n        </div>\n      </div>\n    </div>\n  </div>\n";
module.directive('grafanaPanel', function () {
    return {
        restrict: 'E',
        template: panelTemplate,
        transclude: true,
        scope: { ctrl: "=" },
        link: function (scope, elem) {
            var panelContainer = elem.find('.panel-container');
            var ctrl = scope.ctrl;
            scope.$watchGroup(['ctrl.fullscreen', 'ctrl.containerHeight'], function () {
                panelContainer.css({ minHeight: ctrl.containerHeight });
                elem.toggleClass('panel-fullscreen', ctrl.fullscreen ? true : false);
            });
        }
    };
});
module.directive('panelResizer', function ($rootScope) {
    return {
        restrict: 'E',
        template: '<span class="resize-panel-handle"></span>',
        link: function (scope, elem) {
            var resizing = false;
            var lastPanel;
            var ctrl = scope.ctrl;
            var handleOffset;
            var originalHeight;
            var originalWidth;
            var maxWidth;
            function dragStartHandler(e) {
                e.preventDefault();
                resizing = true;
                handleOffset = __WEBPACK_IMPORTED_MODULE_1_jquery___default()(e.target).offset();
                originalHeight = parseInt(ctrl.row.height);
                originalWidth = ctrl.panel.span;
                maxWidth = __WEBPACK_IMPORTED_MODULE_1_jquery___default()(document).width();
                lastPanel = ctrl.row.panels[ctrl.row.panels.length - 1];
                __WEBPACK_IMPORTED_MODULE_1_jquery___default()('body').on('mousemove', moveHandler);
                __WEBPACK_IMPORTED_MODULE_1_jquery___default()('body').on('mouseup', dragEndHandler);
            }
            function moveHandler(e) {
                ctrl.row.height = originalHeight + (e.pageY - handleOffset.top);
                ctrl.panel.span = originalWidth + (((e.pageX - handleOffset.left) / maxWidth) * 12);
                ctrl.panel.span = Math.min(Math.max(ctrl.panel.span, 1), 12);
                var rowSpan = ctrl.dashboard.rowSpan(ctrl.row);
                // auto adjust other panels
                if (Math.floor(rowSpan) < 14) {
                    // last panel should not push row down
                    if (lastPanel === ctrl.panel && rowSpan > 12) {
                        lastPanel.span -= rowSpan - 12;
                    }
                    else if (lastPanel !== ctrl.panel) {
                        // reduce width of last panel so total in row is 12
                        lastPanel.span = lastPanel.span - (rowSpan - 12);
                        lastPanel.span = Math.min(Math.max(lastPanel.span, 1), 12);
                    }
                }
                scope.$apply(function () {
                    ctrl.render();
                });
            }
            function dragEndHandler() {
                // if close to 12
                var rowSpan = ctrl.dashboard.rowSpan(ctrl.row);
                if (rowSpan < 12 && rowSpan > 11) {
                    lastPanel.span += 12 - rowSpan;
                }
                scope.$apply(function () {
                    $rootScope.$broadcast('render');
                });
                __WEBPACK_IMPORTED_MODULE_1_jquery___default()('body').off('mousemove', moveHandler);
                __WEBPACK_IMPORTED_MODULE_1_jquery___default()('body').off('mouseup', dragEndHandler);
            }
            elem.on('mousedown', dragStartHandler);
            scope.$on("$destroy", function () {
                elem.off('mousedown', dragStartHandler);
            });
        }
    };
});


/***/ }),

/***/ 1176:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(16),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, $) {
  "use strict";

  var module = angular.module('grafana.routes');

  module.controller('SoloPanelCtrl', function($scope, $routeParams, $location, dashboardLoaderSrv, contextSrv) {

    var panelId;

    $scope.init = function() {
      contextSrv.sidemenu = false;

      var params = $location.search();
      panelId = parseInt(params.panelId);

      dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug).then(function(result) {
        $scope.initDashboard(result, $scope);
      });

      $scope.onAppEvent("dashboard-loaded", $scope.initPanelScope);
    };

    $scope.initPanelScope = function() {
      $scope.row = {
        height: $(window).height() + 'px',
      };

      $scope.test = "Hej";
      $scope.$index = 0;
      $scope.panel = $scope.dashboard.getPanelById(panelId);

      if (!$scope.panel) {
        $scope.appEvent('alert-error', ['Panel not found', '']);
        return;
      }

      $scope.panel.span = 12;
    };

    $scope.init();
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1177:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
///<reference path="../../headers/common.d.ts" />

var directiveModule = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('grafana.directives');
/** @ngInject */
function panelEditorTab(dynamicDirectiveSrv) {
    return dynamicDirectiveSrv.create({
        scope: {
            ctrl: "=",
            editorTab: "=",
            index: "=",
        },
        directive: function (scope) {
            var pluginId = scope.ctrl.pluginId;
            var tabIndex = scope.index;
            return Promise.resolve({
                name: "panel-editor-tab-" + pluginId + tabIndex,
                fn: scope.editorTab.directiveFn,
            });
        }
    });
}
directiveModule.directive('panelEditorTab', panelEditorTab);


/***/ }),

/***/ 1178:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryRowCtrl", function() { return QueryRowCtrl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
///<reference path="../../headers/common.d.ts" />


var module = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('grafana.directives');
var QueryRowCtrl = /** @class */ (function () {
    function QueryRowCtrl() {
        this.panelCtrl = this.queryCtrl.panelCtrl;
        this.target = this.queryCtrl.target;
        this.panel = this.panelCtrl.panel;
        if (!this.target.refId) {
            this.target.refId = this.getNextQueryLetter();
        }
        this.toggleCollapse(true);
        if (this.target.isNew) {
            delete this.target.isNew;
            this.toggleCollapse(false);
        }
    }
    QueryRowCtrl.prototype.toggleHideQuery = function () {
        this.target.hide = !this.target.hide;
        this.panelCtrl.refresh();
    };
    QueryRowCtrl.prototype.getNextQueryLetter = function () {
        var _this = this;
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.find(letters, function (refId) {
            return __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.every(_this.panel.targets, function (other) {
                return other.refId !== refId;
            });
        });
    };
    QueryRowCtrl.prototype.toggleCollapse = function (init) {
        if (!this.canCollapse) {
            return;
        }
        if (!this.panelCtrl.__collapsedQueryCache) {
            this.panelCtrl.__collapsedQueryCache = {};
        }
        if (init) {
            this.collapsed = this.panelCtrl.__collapsedQueryCache[this.target.refId] !== false;
        }
        else {
            this.collapsed = !this.collapsed;
            this.panelCtrl.__collapsedQueryCache[this.target.refId] = this.collapsed;
        }
        try {
            this.collapsedText = this.queryCtrl.getCollapsedText();
        }
        catch (e) {
            var err = e.message || e.toString();
            this.collapsedText = 'Error: ' + err;
        }
    };
    QueryRowCtrl.prototype.toggleEditorMode = function () {
        if (this.canCollapse && this.collapsed) {
            this.collapsed = false;
        }
        this.queryCtrl.toggleEditorMode();
    };
    QueryRowCtrl.prototype.removeQuery = function () {
        if (this.panelCtrl.__collapsedQueryCache) {
            delete this.panelCtrl.__collapsedQueryCache[this.target.refId];
        }
        this.panel.targets = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.without(this.panel.targets, this.target);
        this.panelCtrl.refresh();
    };
    QueryRowCtrl.prototype.duplicateQuery = function () {
        var clone = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.copy(this.target);
        clone.refId = this.getNextQueryLetter();
        this.panel.targets.push(clone);
    };
    QueryRowCtrl.prototype.moveQuery = function (direction) {
        var index = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.indexOf(this.panel.targets, this.target);
        __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.move(this.panel.targets, index, index + direction);
    };
    return QueryRowCtrl;
}());

/** @ngInject **/
function queryEditorRowDirective() {
    return {
        restrict: 'E',
        controller: QueryRowCtrl,
        bindToController: true,
        controllerAs: "ctrl",
        templateUrl: 'public/app/features/panel/partials/query_editor_row.html',
        transclude: true,
        scope: {
            queryCtrl: "=",
            canCollapse: "=",
            hasTextEditMode: "=",
        },
    };
}
module.directive('queryEditorRow', queryEditorRowDirective);


/***/ }),

/***/ 1179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MetricsDsSelectorCtrl", function() { return MetricsDsSelectorCtrl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
///<reference path="../../headers/common.d.ts" />


var module = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('grafana.directives');
var template = "\n<div class=\"gf-form-group\">\n  <div class=\"gf-form-inline\">\n    <div class=\"gf-form\">\n      <label class=\"gf-form-label\">\n        <i class=\"fa fa-database\"></i>\n      </label>\n      <label class=\"gf-form-label\">\n        \u6570\u636E\u6E90\n      </label>\n\n      <metric-segment segment=\"ctrl.dsSegment\" style-mode=\"select\"\n                      get-options=\"ctrl.getOptions()\"\n                      on-change=\"ctrl.datasourceChanged()\"></metric-segment>\n    </div>\n\n    <div class=\"gf-form gf-form--offset-1\">\n      <button class=\"btn btn-inverse gf-form-btn\" ng-click=\"ctrl.addDataQuery()\" ng-hide=\"ctrl.current.meta.mixed\">\n        <i class=\"fa fa-plus\"></i>&nbsp;\n        \u67E5\u8BE2\n      </button>\n\n      <div class=\"dropdown\" ng-if=\"ctrl.current.meta.mixed\">\n        <button class=\"btn btn-inverse dropdown-toggle gf-form-btn\" data-toggle=\"dropdown\">\n          Add Query&nbsp;<span class=\"fa fa-caret-down\"></span>\n        </button>\n\n        <ul class=\"dropdown-menu\" role=\"menu\">\n          <li ng-repeat=\"datasource in ctrl.datasources\" role=\"menuitem\" ng-hide=\"datasource.meta.builtIn\">\n            <a ng-click=\"ctrl.addDataQuery(datasource);\">{{datasource.name}}</a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </div>\n</div>\n";
var MetricsDsSelectorCtrl = /** @class */ (function () {
    /** @ngInject */
    function MetricsDsSelectorCtrl(uiSegmentSrv, datasourceSrv) {
        this.uiSegmentSrv = uiSegmentSrv;
        this.datasources = datasourceSrv.getMetricSources();
        var dsValue = this.panelCtrl.panel.datasource || null;
        for (var _i = 0, _a = this.datasources; _i < _a.length; _i++) {
            var ds = _a[_i];
            if (ds.value === dsValue) {
                this.current = ds;
            }
        }
        if (!this.current) {
            this.current = { name: dsValue + ' not found', value: null };
        }
        this.dsSegment = uiSegmentSrv.newSegment(this.current.name);
    }
    MetricsDsSelectorCtrl.prototype.getOptions = function () {
        var _this = this;
        return Promise.resolve(this.datasources.map(function (value) {
            return _this.uiSegmentSrv.newSegment(value.name);
        }));
    };
    MetricsDsSelectorCtrl.prototype.datasourceChanged = function () {
        var ds = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.findWhere(this.datasources, { name: this.dsSegment.value });
        if (ds) {
            this.current = ds;
            this.panelCtrl.setDatasource(ds);
        }
    };
    MetricsDsSelectorCtrl.prototype.addDataQuery = function (datasource) {
        var target = { isNew: true };
        if (datasource) {
            target.datasource = datasource.name;
        }
        this.panelCtrl.panel.targets.push(target);
    };
    return MetricsDsSelectorCtrl;
}());

module.directive('metricsDsSelector', function () {
    return {
        restrict: 'E',
        template: template,
        controller: MetricsDsSelectorCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        transclude: true,
        scope: {
            panelCtrl: "="
        }
    };
});


/***/ }),

/***/ 1180:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(1181),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _) {
  'use strict';

  angular
    .module('grafana.directives')
    .directive('panelLinksEditor', function() {
      return {
        scope: {
          panel: "="
        },
        restrict: 'E',
        controller: 'PanelLinksEditorCtrl',
        templateUrl: 'public/app/features/panellinks/module.html',
        link: function() {
        }
      };
    }).controller('PanelLinksEditorCtrl', function($scope, backendSrv) {

      $scope.panel.links = $scope.panel.links || [];

      $scope.addLink = function() {
        $scope.panel.links.push({
          type: 'dashboard',
        });
      };

      $scope.searchDashboards = function(queryStr, callback) {
        backendSrv.search({query: queryStr}).then(function(hits) {
          var dashboards = _.map(hits, function(dash) {
            return dash.title;
          });

          callback(dashboards);
        });
      };

      $scope.dashboardChanged = function(link) {
        backendSrv.search({query: link.dashboard}).then(function(hits) {
          var dashboard = _.findWhere(hits, {title: link.dashboard});
          if (dashboard) {
            link.dashUri = dashboard.uri;
            link.title = dashboard.title;
          }
        });
      };

      $scope.deleteLink = function(link) {
        $scope.panel.links = _.without($scope.panel.links, link);
      };
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1181:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(93),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, kbn) {
  'use strict';

  kbn = kbn.default;

  angular
    .module('grafana.services')
    .service('linkSrv', function(templateSrv, timeSrv) {

      this.getLinkUrl = function(link) {
        var url = templateSrv.replace(link.url || '');
        var params = {};

        if (link.keepTime) {
          var range = timeSrv.timeRangeForUrl();
          params['from'] = range.from;
          params['to'] = range.to;
        }

        if (link.includeVars) {
          templateSrv.fillVariableValuesForUrl(params);
        }

        return this.addParamsToUrl(url, params);
      };

      this.addParamsToUrl = function(url, params) {
        var paramsArray = [];
        _.each(params, function(value, key) {
          if (value === null) { return; }
          if (value === true) {
            paramsArray.push(key);
          }
          else if (_.isArray(value)) {
            _.each(value, function(instance) {
              paramsArray.push(key + '=' + encodeURIComponent(instance));
            });
          }
          else {
            paramsArray.push(key + '=' + encodeURIComponent(value));
          }
        });

        if (paramsArray.length === 0) {
          return url;
        }

        return this.appendToQueryString(url, paramsArray.join('&'));
      };

      this.appendToQueryString = function(url, stringToAppend) {
        if (!_.isUndefined(stringToAppend) && stringToAppend !== null && stringToAppend !== '') {
          var pos = url.indexOf('?');
          if (pos !== -1) {
            if (url.length - pos > 1) {
              url += '&';
            }
          } else {
            url += '?';
          }
          url += stringToAppend;
        }
        return url;
      };

      this.getAnchorInfo = function(link) {
        var info = {};
        info.href = this.getLinkUrl(link);
        info.title = templateSrv.replace(link.title || '');
        return info;
      };

      this.getPanelLinkAnchorInfo = function(link, scopedVars) {
        var info = {};
        if (link.type === 'absolute') {
          info.target = link.targetBlank ? '_blank' : '_self';
          info.href = templateSrv.replace(link.url || '', scopedVars);
          info.title = templateSrv.replace(link.title || '', scopedVars);
        }
        else if (link.dashUri) {
          info.href = 'dashboard/' + link.dashUri + '?';
          info.title = templateSrv.replace(link.title || '', scopedVars);
          info.target = link.targetBlank ? '_blank' : '';
        }
        else {
          info.title = templateSrv.replace(link.title || '', scopedVars);
          var slug = kbn.slugifyForUrl(link.dashboard || '');
          info.href = 'dashboard/db/' + slug + '?';
        }

        var params = {};

        if (link.keepTime) {
          var range = timeSrv.timeRangeForUrl();
          params['from'] = range.from;
          params['to'] = range.to;
        }

        if (link.includeVars) {
          templateSrv.fillVariableValuesForUrl(params, scopedVars);
        }

        info.href = this.addParamsToUrl(info.href, params);

        if (link.params) {
          info.href = this.appendToQueryString(info.href, templateSrv.replace(link.params, scopedVars));
        }

        return info;
      };

    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnnotationsSrv", function() { return AnnotationsSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__editor_ctrl__ = __webpack_require__(1183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__editor_ctrl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__editor_ctrl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />




var AnnotationsSrv = /** @class */ (function () {
    // alertStatesPromise: any;
    /** @ngInject */
    function AnnotationsSrv($rootScope, $q, datasourceSrv, backendSrv, timeSrv) {
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.datasourceSrv = datasourceSrv;
        this.backendSrv = backendSrv;
        this.timeSrv = timeSrv;
        this.list = [];
        $rootScope.onAppEvent('refresh', this.clearCache.bind(this), $rootScope);
        $rootScope.onAppEvent('dashboard-initialized', this.clearCache.bind(this), $rootScope);
    }
    AnnotationsSrv.prototype.clearCache = function () {
        this.globalAnnotationsPromise = null;
        // this.alertStatesPromise = null;
    };
    AnnotationsSrv.prototype.getAnnotations = function (options) {
        var _this = this;
        return this.$q.all([
            this.getGlobalAnnotations(options),
            this.getPanelAnnotations(options),
        ]).then(function (results) {
            // combine the annotations and flatten results
            var annotations = __WEBPACK_IMPORTED_MODULE_2_lodash___default.a.flattenDeep([results[0], results[1]]);
            // look for alert state for this panel
            // var alertState = _.find(results[2], {panelId: options.panel.id});
            return {
                annotations: annotations,
            };
        }).catch(function (err) {
            _this.$rootScope.appEvent('alert-error', ['Annotations failed', (err.message || err.statusText || err)]);
        });
    };
    AnnotationsSrv.prototype.getPanelAnnotations = function (options) {
        var _this = this;
        var panel = options.panel;
        var dashboard = options.dashboard;
        if (panel && panel.alert) {
            return this.backendSrv.get('/api/annotations', {
                from: options.range.from.valueOf(),
                to: options.range.to.valueOf(),
                limit: 100,
                panelId: panel.id,
                dashboardId: dashboard.id,
            }).then(function (results) {
                return _this.translateQueryResult({ iconColor: '#AA0000', name: 'panel-alert' }, results);
            });
        }
        return this.$q.when([]);
    };
    // getAlertStates(options) {
    //   if (!options.dashboard.id) {
    //     return this.$q.when([]);
    //   }
    //   // ignore if no alerts
    //   if (options.panel && !options.panel.alert) {
    //     return this.$q.when([]);
    //   }
    //   if (options.range.raw.to !== 'now') {
    //     return this.$q.when([]);
    //   }
    //   if (this.alertStatesPromise) {
    //     return this.alertStatesPromise;
    //   }
    //   this.alertStatesPromise = this.backendSrv.get('/api/alerts/states-for-dashboard', {dashboardId: options.dashboard.id});
    //   return this.alertStatesPromise;
    // }
    AnnotationsSrv.prototype.getGlobalAnnotations = function (options) {
        var _this = this;
        var dashboard = options.dashboard;
        if (dashboard.annotations.list.length === 0) {
            if (!__WEBPACK_IMPORTED_MODULE_2_lodash___default.a.isNull(dashboard.manualAnnotation)) {
                return this.$q.when(dashboard.manualAnnotation);
            }
            return this.$q.when([]);
        }
        if (this.globalAnnotationsPromise) {
            return this.globalAnnotationsPromise;
        }
        var annotations = __WEBPACK_IMPORTED_MODULE_2_lodash___default.a.filter(dashboard.annotations.list, { enable: true });
        var range = this.timeSrv.timeRange();
        this.globalAnnotationsPromise = this.$q.all(__WEBPACK_IMPORTED_MODULE_2_lodash___default.a.map(annotations, function (annotation) {
            if (annotation.snapshotData) {
                return _this.translateQueryResult(annotation, annotation.snapshotData);
            }
            return _this.datasourceSrv.get(annotation.datasource).then(function (datasource) {
                // issue query against data source
                return datasource.annotationQuery({ range: range, rangeRaw: range.raw, annotation: annotation });
            })
                .then(function (results) {
                // store response in annotation object if this is a snapshot call
                if (dashboard.snapshot) {
                    annotation.snapshotData = __WEBPACK_IMPORTED_MODULE_1_angular___default.a.copy(results);
                }
                // translate result
                return _this.translateQueryResult(annotation, results);
            });
        }));
        return this.globalAnnotationsPromise;
    };
    AnnotationsSrv.prototype.translateQueryResult = function (annotation, results) {
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var item = results_1[_i];
            item.source = annotation;
            item.min = item.time;
            item.max = item.time;
            item.scope = 1;
            item.eventType = annotation.name;
        }
        return results;
    };
    return AnnotationsSrv;
}());

__WEBPACK_IMPORTED_MODULE_3_app_core_core_module__["default"].service('annotationsSrv', AnnotationsSrv);


/***/ }),

/***/ 1183:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Final loader didn't return a Buffer or String\n    at runLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/webpack/lib/NormalModule.js:204:46)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:370:3\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:211:10)\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:218:10)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:233:3\n    at context.callback (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),

/***/ 1184:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(1185),
  __webpack_require__(1186),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _) {
  'use strict';

  var module = angular.module('grafana.services');

  module.service('templateSrv', function() {
    var self = this;

    this._regex = /\$(\w+)|\[\[([\s\S]+?)\]\]/g;
    this._index = {};
    this._texts = {};
    this._grafanaVariables = {};

    this.init = function(variables) {
      this.variables = variables;
      this.updateTemplateData();
    };

    this.updateTemplateData = function() {
      this._index = {};

      for (var i = 0; i < this.variables.length; i++) {
        var variable = this.variables[i];
        if (!variable.current || !variable.current.isNone && !variable.current.value) {
          continue;
        }
        this._index[variable.name] = variable;
      }
    };

    function regexEscape(value) {
      return value.replace(/[\\^$*+?.()|[\]{}\/]/g, '\\$&');
    }

    function luceneEscape(value) {
      return value.replace(/([\!\*\+\-\=<>\s\&\|\(\)\[\]\{\}\^\~\?\:\\/"])/g, "\\$1");
    }

    this.formatValue = function(value, format, variable) {
      // for some scopedVars there is no variable
      variable = variable || {};

      if (typeof format === 'function') {
        return format(value, variable, this.formatValue);
      }

      switch(format) {
        case "regex": {
          if (typeof value === 'string') {
            return regexEscape(value);
          }

          var escapedValues = _.map(value, regexEscape);
          return '(' + escapedValues.join('|') + ')';
        }
        case "lucene": {
          if (typeof value === 'string') {
            return luceneEscape(value);
          }
          var quotedValues = _.map(value, function(val) {
            return '\"' + luceneEscape(val) + '\"';
          });
          return '(' + quotedValues.join(' OR ') + ')';
        }
        case "pipe": {
          if (typeof value === 'string') {
            return value;
          }
          return value.join('|');
        }
        default:  {
          if (typeof value === 'string') {
            return value;
          }
          return '{' + value.join(',') + '}';
        }
      }
    };

    this.setGrafanaVariable = function (name, value) {
      this._grafanaVariables[name] = value;
    };

    this.variableExists = function(expression) {
      this._regex.lastIndex = 0;
      var match = this._regex.exec(expression);
      return match && (self._index[match[1] || match[2]] !== void 0);
    };

    this.containsVariable = function(str, variableName) {
      if (!str) {
        return false;
      }
      return str.indexOf('$' + variableName) !== -1 || str.indexOf('[[' + variableName + ']]') !== -1;
    };

    this.highlightVariablesAsHtml = function(str) {
      if (!str || !_.isString(str)) { return str; }

      str = _.escape(str);
      this._regex.lastIndex = 0;
      return str.replace(this._regex, function(match, g1, g2) {
        if (self._index[g1 || g2]) {
          return '<span class="template-variable">' + match + '</span>';
        }
        return match;
      });
    };

    this.getAllValue = function(variable) {
      if (variable.allValue) {
        return variable.allValue;
      }
      var values = [];
      for (var i = 1; i < variable.options.length; i++) {
        values.push(variable.options[i].value);
      }
      return values;
    };

    this.replace = function(target, scopedVars, format) {
      if (!target) { return target; }

      var variable, systemValue, value;
      this._regex.lastIndex = 0;

      return target.replace(this._regex, function(match, g1, g2) {
        variable = self._index[g1 || g2];

        if (scopedVars) {
          value = scopedVars[g1 || g2];
          if (value) {
            return self.formatValue(value.value, format, variable);
          }
        }

        if (!variable) {
          return match;
        }

        systemValue = self._grafanaVariables[variable.current.value];
        if (systemValue) {
          return self.formatValue(systemValue, format, variable);
        }

        value = variable.current.value;
        if (self.isAllValue(value)) {
          value = self.getAllValue(variable);
          // skip formating of custom all values
          if (variable.allValue) {
            return value;
          }
        }

        var res = self.formatValue(value, format, variable);
        return res;
      });
    };

    this.isAllValue = function(value) {
      return value === '$__all' || Array.isArray(value) && value[0] === '$__all';
    };

    this.replaceWithText = function(target, scopedVars) {
      if (!target) { return target; }

      var variable;
      this._regex.lastIndex = 0;

      return target.replace(this._regex, function(match, g1, g2) {
        if (scopedVars) {
          var option = scopedVars[g1 || g2];
          if (option) { return option.text; }
        }

        variable = self._index[g1 || g2];
        if (!variable) { return match; }

        return self._grafanaVariables[variable.current.value] || variable.current.text;
      });
    };

    this.fillVariableValuesForUrl = function(params, scopedVars) {
      _.each(this.variables, function(variable) {
        var current = variable.current;
        var value = current.value;

        if (current.text === 'All') {
          value = 'All';
        }

        if (scopedVars && scopedVars[variable.name] !== void 0) {
          value = scopedVars[variable.name].value;
        }

        params['var-' + variable.name] = value;
      });
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1185:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('TemplateEditorCtrl', function($scope, datasourceSrv, templateSrv, templateValuesSrv) {

    var replacementDefaults = {
      type: 'query',
      datasource: null,
      refresh: 0,
      name: '',
      hide: 0,
      options: [],
      includeAll: false,
      multi: false,
    };

    $scope.variableTypes = [
      {value: "query",      text: "Query"},
      {value: "interval",   text: "Interval"},
      {value: "datasource", text: "Data source"},
      {value: "custom",     text: "Custom"},
    ];

    $scope.refreshOptions = [
      {value: 0, text: "Never"},
      {value: 1, text: "On Dashboard Load"},
      {value: 2, text: "On Time Range Change"},
    ];

    $scope.hideOptions = [
      {value: 0, text: ""},
      {value: 1, text: "Label"},
      {value: 2, text: "Variable"},
    ];

    $scope.init = function() {
      $scope.mode = 'list';

      $scope.datasourceTypes = {};
      $scope.datasources = _.filter(datasourceSrv.getMetricSources(), function(ds) {
        $scope.datasourceTypes[ds.meta.id] = {text: ds.meta.name, value: ds.meta.id};
        return !ds.meta.builtIn;
      });

      $scope.datasourceTypes = _.map($scope.datasourceTypes, function(value) {
        return value;
      });

      $scope.variables = templateSrv.variables;
      $scope.reset();

      $scope.$watch('mode', function(val) {
        if (val === 'new') {
          $scope.reset();
        }
      });

      $scope.$watch('current.datasource', function(val) {
        if ($scope.mode === 'new') {
          datasourceSrv.get(val).then(function(ds) {
            if (ds.meta.defaultMatchFormat) {
              $scope.current.allFormat = ds.meta.defaultMatchFormat;
              $scope.current.multiFormat = ds.meta.defaultMatchFormat;
            }
          });
        }
      });
    };

    $scope.add = function() {
      if ($scope.isValid()) {
        $scope.variables.push($scope.current);
        $scope.update();
        $scope.updateSubmenuVisibility();
      }
    };

    $scope.isValid = function() {
      if (!$scope.current.name) {
        $scope.appEvent('alert-warning', ['失败', '模板变量必须要一个名字']);
        return false;
      }

      if (!$scope.current.name.match(/^\w+$/)) {
        $scope.appEvent('alert-warning', ['失败', '只有字符和数字被允许在变量名']);
        return false;
      }

      var sameName = _.findWhere($scope.variables, { name: $scope.current.name });
      if (sameName && sameName !== $scope.current) {
        $scope.appEvent('alert-warning', ['失败', '名字相同的变量已存在']);
        return false;
      }

      return true;
    };

    $scope.runQuery = function() {
      return templateValuesSrv.updateOptions($scope.current).then(null, function(err) {
        if (err.data && err.data.message) { err.message = err.data.message; }
        $scope.appEvent("alert-error", ['模板', '模板变量不能被初始化: ' + err.message]);
      });
    };

    $scope.edit = function(variable) {
      $scope.current = variable;
      $scope.currentIsNew = false;
      $scope.mode = 'edit';

      if ($scope.current.datasource === void 0) {
        $scope.current.datasource = null;
        $scope.current.type = 'query';
        $scope.current.allFormat = 'glob';
      }
    };

    $scope.duplicate = function(variable) {
      $scope.current = angular.copy(variable);
      $scope.variables.push($scope.current);
      $scope.current.name = 'copy_of_'+variable.name;
      $scope.updateSubmenuVisibility();
    };

    $scope.update = function() {
      if ($scope.isValid()) {
        $scope.runQuery().then(function() {
          $scope.reset();
          $scope.mode = 'list';
        });
      }
    };

    $scope.reset = function() {
      $scope.currentIsNew = true;
      $scope.current = angular.copy(replacementDefaults);
    };

    $scope.typeChanged = function () {
      if ($scope.current.type === 'interval') {
        $scope.current.query = '1m,10m,30m,1h,6h,12h,1d,7d,14d,30d';
      }

      if ($scope.current.type === 'query') {
        $scope.current.query = '';
      }

      if ($scope.current.type === 'datasource') {
        $scope.current.query = $scope.datasourceTypes[0].value;
        $scope.current.regex = '';
        $scope.current.refresh = 1;
      }
    };

    $scope.removeVariable = function(variable) {
      var index = _.indexOf($scope.variables, variable);
      $scope.variables.splice(index, 1);
      $scope.updateSubmenuVisibility();
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1186:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(93),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, kbn) {
  'use strict';

  kbn = kbn.default;

  var module = angular.module('grafana.services');

  module.service('templateValuesSrv', function($q, $rootScope, datasourceSrv, $location, templateSrv, timeSrv) {
    var self = this;

    function getNoneOption() { return { text: 'None', value: '', isNone: true }; }

    // update time variant variables
    $rootScope.onAppEvent('refresh', function() {

      // look for interval variables
      var intervalVariable = _.findWhere(self.variables, { type: 'interval' });
      if (intervalVariable) {
        self.updateAutoInterval(intervalVariable);
      }

      // update variables with refresh === 2
      var promises = self.variables
        .filter(function(variable) {
          return variable.refresh === 2;
        }).map(function(variable) {
          return self.updateOptions(variable);
        });

      return $q.all(promises);

    }, $rootScope);

    this.init = function(dashboard) {
      this.variables = dashboard.templating.list;
      templateSrv.init(this.variables);

      var queryParams = $location.search();
      var promises = [];

      // use promises to delay processing variables that
      // depend on other variables.
      this.variableLock = {};
      _.forEach(this.variables, function(variable) {
        self.variableLock[variable.name] = $q.defer();
      });

      for (var i = 0; i < this.variables.length; i++) {
        var variable = this.variables[i];
        promises.push(this.processVariable(variable, queryParams));
      }

      return $q.all(promises);
    };

    this.processVariable = function(variable, queryParams) {
      var dependencies = [];
      var lock = self.variableLock[variable.name];

      // determine our dependencies.
      if (variable.type === "query") {
        _.forEach(this.variables, function(v) {
          // both query and datasource can contain variable
          if (templateSrv.containsVariable(variable.query, v.name) ||
              templateSrv.containsVariable(variable.datasource, v.name)) {
            dependencies.push(self.variableLock[v.name].promise);
          }
        });
      }

      return $q.all(dependencies).then(function() {
        var urlValue = queryParams['var-' + variable.name];
        if (urlValue !== void 0) {
          return self.setVariableFromUrl(variable, urlValue).then(lock.resolve);
        }
        else if (variable.refresh === 1 || variable.refresh === 2) {
          return self.updateOptions(variable).then(function() {
            if (_.isEmpty(variable.current) && variable.options.length) {
              console.log("setting current for %s", variable.name);
              self.setVariableValue(variable, variable.options[0]);
            }
            lock.resolve();
          });
        }
        else if (variable.type === 'interval') {
          self.updateAutoInterval(variable);
          lock.resolve();
        } else {
          lock.resolve();
        }
      });
    };

    this.setVariableFromUrl = function(variable, urlValue) {
      var promise = $q.when(true);

      if (variable.refresh) {
        promise = this.updateOptions(variable);
      }

      return promise.then(function() {
        var option = _.findWhere(variable.options, { text: urlValue });
        option = option || { text: urlValue, value: urlValue };

        self.updateAutoInterval(variable);
        return self.setVariableValue(variable, option, true);
      });
    };

    this.updateAutoInterval = function(variable) {
      if (!variable.auto) { return; }

      // add auto option if missing
      if (variable.options.length && variable.options[0].text !== 'auto') {
        variable.options.unshift({ text: 'auto', value: '$__auto_interval' });
      }

      var interval = kbn.calculateInterval(timeSrv.timeRange(), variable.auto_count, (variable.auto_min ? ">"+variable.auto_min : null));
      templateSrv.setGrafanaVariable('$__auto_interval', interval);
    };

    this.setVariableValue = function(variable, option, initPhase) {
      variable.current = angular.copy(option);

      if (_.isArray(variable.current.value)) {
        variable.current.text = variable.current.value.join(' + ');
      }

      self.selectOptionsForCurrentValue(variable);
      templateSrv.updateTemplateData();

      // on first load, variable loading is ordered to ensure
      // that parents are updated before children.
      if (initPhase) {
        return $q.when();
      }

      return self.updateOptionsInChildVariables(variable);
    };

    this.variableUpdated = function(variable) {
      templateSrv.updateTemplateData();
      return this.updateOptionsInChildVariables(variable);
    };

    this.updateOptionsInChildVariables = function(updatedVariable) {
      var promises = _.map(self.variables, function(otherVariable) {
        if (otherVariable === updatedVariable) {
          return;
        }
        if (templateSrv.containsVariable(otherVariable.query, updatedVariable.name) ||
            templateSrv.containsVariable(otherVariable.datasource, updatedVariable.name)) {
          return self.updateOptions(otherVariable);
        }
      });

      return $q.all(promises);
    };

    this._updateNonQueryVariable = function(variable) {
      if (variable.type === 'datasource') {
        self.updateDataSourceVariable(variable);
        return;
      }

      // extract options in comma seperated string
      variable.options = _.map(variable.query.split(/[,]+/), function(text) {
        return { text: text.trim(), value: text.trim() };
      });

      if (variable.type === 'interval') {
        self.updateAutoInterval(variable);
      }

      if (variable.type === 'custom' && variable.includeAll) {
        self.addAllOption(variable);
      }
    };

    this.updateDataSourceVariable = function(variable) {
      var options = [];
      var sources = datasourceSrv.getMetricSources({skipVariables: true});
      var regex;

      if (variable.regex) {
        regex = kbn.stringToJsRegex(templateSrv.replace(variable.regex));
      }

      for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        // must match on type
        if (source.meta.id !== variable.query) {
          continue;
        }

        if (regex && !regex.exec(source.name)) {
          continue;
        }

        options.push({text: source.name, value: source.name});
      }

      if (options.length === 0) {
        options.push({text: 'No datasurces found', value: ''});
      }

      variable.options = options;
    };

    this.updateOptions = function(variable) {
      if (variable.type !== 'query') {
        self._updateNonQueryVariable(variable);
        return self.validateVariableSelectionState(variable);
      }

      return datasourceSrv.get(variable.datasource)
        .then(_.partial(this.updateOptionsFromMetricFindQuery, variable))
        .then(_.partial(this.updateTags, variable))
        .then(_.partial(this.validateVariableSelectionState, variable));
    };

    this.selectOptionsForCurrentValue = function(variable) {
      var i, y, value, option;

      for (i = 0; i < variable.options.length; i++) {
        option = variable.options[i];
        option.selected = false;
        if (_.isArray(variable.current.value)) {
          for (y = 0; y < variable.current.value.length; y++) {
            value = variable.current.value[y];
            if (option.value === value) {
              option.selected = true;
            }
          }
        } else if (option.value === variable.current.value) {
          option.selected = true;
        }
      }
    };

    this.validateVariableSelectionState = function(variable) {
      if (!variable.current) {
        if (!variable.options.length) { return; }
        return self.setVariableValue(variable, variable.options[0], true);
      }

      if (_.isArray(variable.current.value)) {
        self.selectOptionsForCurrentValue(variable);
      } else {
        var currentOption = _.findWhere(variable.options, {text: variable.current.text});
        if (currentOption) {
          return self.setVariableValue(variable, currentOption, true);
        } else {
          if (!variable.options.length) { return; }
          return self.setVariableValue(variable, variable.options[0]);
        }
      }
    };

    this.updateTags = function(variable, datasource) {
      if (variable.useTags) {
        return datasource.metricFindQuery(variable.tagsQuery).then(function (results) {
          variable.tags = [];
          for (var i = 0; i < results.length; i++) {
            variable.tags.push(results[i].text);
          }
          return datasource;
        });
      } else {
        delete variable.tags;
      }

      return datasource;
    };

    this.updateOptionsFromMetricFindQuery = function(variable, datasource) {
      return datasource.metricFindQuery(variable.query).then(function (results) {
        variable.options = self.metricNamesToVariableValues(variable, results);
        if (variable.includeAll) {
          self.addAllOption(variable);
        }
        if (!variable.options.length) {
          variable.options.push(getNoneOption());
        }
        return datasource;
      });
    };

    this.getValuesForTag = function(variable, tagKey) {
      return datasourceSrv.get(variable.datasource).then(function(datasource) {
        var query = variable.tagValuesQuery.replace('$tag', tagKey);
        return datasource.metricFindQuery(query).then(function (results) {
          return _.map(results, function(value) {
            return value.text;
          });
        });
      });
    };

    this.metricNamesToVariableValues = function(variable, metricNames) {
      var regex, options, i, matches;
      options = {}; // use object hash to remove duplicates

      if (variable.regex) {
        regex = kbn.stringToJsRegex(templateSrv.replace(variable.regex));
      }

      for (i = 0; i < metricNames.length; i++) {
        var item = metricNames[i];
        var value = item.value || item.text;
        var text = item.text || item.value;

        if (regex) {
          matches = regex.exec(value);
          if (!matches) { continue; }
          if (matches.length > 1) {
            value = matches[1];
            text = value;
          }
        }

        options[value] = {text: text, value: value};
      }

      return _.sortBy(options, 'text');
    };

    this.addAllOption = function(variable) {
      variable.options.unshift({text: 'All', value: "$__all"});
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1187:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(1189),
  __webpack_require__(1198),
  __webpack_require__(1190),
  __webpack_require__(1191),
  __webpack_require__(1192),
  __webpack_require__(1193),
  __webpack_require__(1194),
  __webpack_require__(1196),
  __webpack_require__(1197),
  __webpack_require__(1188),
  __webpack_require__(1199),
  __webpack_require__(1200),
  __webpack_require__(1201),
  __webpack_require__(1202),
  __webpack_require__(1204),
  __webpack_require__(1205),
  __webpack_require__(1206),
  __webpack_require__(1172),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1188:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(16),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(angular, $) {
  "use strict";

  var module = angular.module('grafana.services');

  module.service('dashboardKeybindings', function($rootScope, keyboardManager, $_modal, $q) {

    this.shortcuts = function(scope) {

      scope.$on('$destroy', function() {
        keyboardManager.unbindAll();
      });

      var helpModalScope = null;
      keyboardManager.bind('shift+?', function() {
        if (helpModalScope) { return; }

        helpModalScope = $rootScope.$new();
        var helpModal = $_modal({
          template: 'public/app/partials/help_modal.html',
          persist: false,
          show: false,
          scope: helpModalScope,
          keyboard: false
        });

        helpModalScope.$on('$destroy', function() { helpModalScope = null; });
        $q.when(helpModal).then(function(modalEl) { modalEl.modal('show'); });

      }, { inputDisabled: true });

      keyboardManager.bind('f', function() {
        scope.appEvent('show-dash-search');
      }, { inputDisabled: true });

      keyboardManager.bind('ctrl+o', function() {
        var current = scope.dashboard.sharedCrosshair;
        scope.dashboard.sharedCrosshair = !current;
        scope.broadcastRefresh();
      }, { inputDisabled: true });

      keyboardManager.bind('ctrl+h', function() {
        var current = scope.dashboard.hideControls;
        scope.dashboard.hideControls = !current;
      }, { inputDisabled: true });

      keyboardManager.bind('ctrl+s', function(evt) {
        scope.appEvent('save-dashboard', evt);
      }, { inputDisabled: true });

      keyboardManager.bind('r', function() {
        scope.broadcastRefresh();
      }, { inputDisabled: true });

      keyboardManager.bind('ctrl+z', function(evt) {
        scope.appEvent('zoom-out', evt);
      }, { inputDisabled: true });

      keyboardManager.bind('left', function(evt) {
        scope.appEvent('shift-time-backward', evt);
      }, { inputDisabled: true });

      keyboardManager.bind('right', function(evt) {
        scope.appEvent('shift-time-forward', evt);
      }, { inputDisabled: true });

      keyboardManager.bind('ctrl+e', function(evt) {
        scope.appEvent('export-dashboard', evt);
      }, { inputDisabled: true });

      keyboardManager.bind('ctrl+i', function(evt) {
        scope.appEvent('quick-snapshot', evt);
      }, { inputDisabled: true });

      keyboardManager.bind('esc', function() {
        var popups = $('.popover.in');
        if (popups.length > 0) {
          return;
        }
        // close modals
        var modalData = $(".modal").data();
        if (modalData && modalData.$scope && modalData.$scope.dismiss) {
          modalData.$scope.dismiss();
        }

        scope.appEvent('hide-dash-editor');

        scope.exitFullscreen();
      }, { inputDisabled: true });
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1189:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(16),
  __webpack_require__(24),
  __webpack_require__(1),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, $, config, moment) {
  "use strict";

  var module = angular.module('grafana.controllers');

  module.controller('DashboardCtrl', function(
      $scope,
      $rootScope,
      dashboardKeybindings,
      timeSrv,
      templateValuesSrv,
      dynamicDashboardSrv,
      dashboardSrv,
      unsavedChangesSrv,
      dashboardViewStateSrv,
      contextSrv,
      $timeout,
      $translate
    ) {

    $scope.editor = { index: 0 };
    $scope.panels = config.panels;

    var resizeEventTimeout;

    this.init = function(dashboard) {
      $scope.resetRow();
      $scope.registerWindowResizeEvent();
      $scope.onAppEvent('show-json-editor', $scope.showJsonEditor);
      $scope.setupDashboard(dashboard);
    };

    $scope.setupDashboard = function(data) {
      $rootScope.performance.dashboardLoadStart = new Date().getTime();
      $rootScope.performance.panelsInitialized = 0;
      $rootScope.performance.panelsRendered = 0;

      var dashboard = dashboardSrv.create(data.dashboard, data.meta);
      dashboardSrv.setCurrent(dashboard);

      // init services
      timeSrv.init(dashboard);

      // template values service needs to initialize completely before
      // the rest of the dashboard can load
      templateValuesSrv.init(dashboard).finally(function() {
        dynamicDashboardSrv.init(dashboard);
        unsavedChangesSrv.init(dashboard, $scope);

        $scope.dashboard = dashboard;
        $scope.dashboardMeta = dashboard.meta;
        $scope.dashboardViewState = dashboardViewStateSrv.create($scope);

        dashboardKeybindings.shortcuts($scope);

        $scope.updateSubmenuVisibility();
        $scope.setWindowTitleAndTheme();

        $scope.appEvent("dashboard-loaded", $scope.dashboard);
      }).catch(function(err) {
        if (err.data && err.data.message) { err.message = err.data.message; }
        $scope.appEvent("alert-error", [$translate.i18n.page_dash_init_err, $translate.i18n.page_dash_err_tip2 + ': ' + err.message]);
      });
    };

    $scope.updateSubmenuVisibility = function() {
      $scope.submenuEnabled = $scope.dashboard.isSubmenuFeaturesEnabled();
    };

    $scope.setWindowTitleAndTheme = function() {
      window.document.title = config.window_title_prefix + $scope.dashboard.title;
    };

    $scope.broadcastRefresh = function() {
      $rootScope.performance.panelsRendered = 0;
      $rootScope.$broadcast('refresh');
    };

    $scope.addRow = function(dash, row) {
      dash.rows.push(row);
    };

    $scope.addRowDefault = function() {
      $scope.resetRow();
      $scope.row.title = 'New row';
      $scope.addRow($scope.dashboard, $scope.row);
    };

    $scope.resetRow = function() {
      $scope.row = {
        title: '',
        height: '250px',
        editable: true,
      };
    };

    $scope.showJsonEditor = function(evt, options) {
      var editScope = $rootScope.$new();
      editScope.object = options.object;
      editScope.updateHandler = options.updateHandler;
      $scope.appEvent('show-dash-editor', { src: 'public/app/partials/edit_json.html', scope: editScope });
    };

    $scope.onDrop = function(panelId, row, dropTarget) {
      var info = $scope.dashboard.getPanelInfoById(panelId);
      if (dropTarget) {
        var dropInfo = $scope.dashboard.getPanelInfoById(dropTarget.id);
        dropInfo.row.panels[dropInfo.index] = info.panel;
        info.row.panels[info.index] = dropTarget;
        var dragSpan = info.panel.span;
        info.panel.span = dropTarget.span;
        dropTarget.span = dragSpan;
      }
      else {
        info.row.panels.splice(info.index, 1);
        info.panel.span = 12 - $scope.dashboard.rowSpan(row);
        row.panels.push(info.panel);
      }

      $rootScope.$broadcast('render');
    };

    $scope.registerWindowResizeEvent = function() {
      angular.element(window).bind('resize', function() {
        $timeout.cancel(resizeEventTimeout);
        resizeEventTimeout = $timeout(function() { $scope.$broadcast('render'); }, 200);
      });
      $scope.$on('$destroy', function() {
        angular.element(window).unbind('resize');
      });
    };

    $scope.timezoneChanged = function() {
      $rootScope.$broadcast("refresh");
    };

    $scope.formatDate = function(date) {
      return moment(date).format('MMM Do YYYY, h:mm:ss a');
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1190:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashNavCtrl", function() { return DashNavCtrl; });
/* harmony export (immutable) */ __webpack_exports__["dashNavDirective"] = dashNavDirective;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_angular__);
///<reference path="../../../headers/common.d.ts" />



var DashNavCtrl = /** @class */ (function () {
    /** @ngInject */
    function DashNavCtrl($scope, $rootScope, alertSrv, $location, playlistSrv, backendSrv, $timeout, $translate) {
        $scope.init = function () {
            $scope.onAppEvent('save-dashboard', $scope.saveDashboard);
            $scope.onAppEvent('delete-dashboard', $scope.deleteDashboard);
            $scope.onAppEvent('export-dashboard', $scope.snapshot);
            $scope.onAppEvent('quick-snapshot', $scope.quickSnapshot);
            $scope.showSettingsMenu = $scope.dashboardMeta.canEdit || $scope.contextSrv.isEditor;
            if ($scope.dashboardMeta.isSnapshot) {
                $scope.showSettingsMenu = false;
                var meta = $scope.dashboardMeta;
                $scope.titleTooltip = 'Created: &nbsp;' + __WEBPACK_IMPORTED_MODULE_1_moment___default()(meta.created).calendar();
                if (meta.expires) {
                    $scope.titleTooltip += '<br>Expires: &nbsp;' + __WEBPACK_IMPORTED_MODULE_1_moment___default()(meta.expires).fromNow() + '<br>';
                }
            }
        };
        $scope.openEditView = function (editview) {
            var search = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.extend($location.search(), { editview: editview });
            $location.search(search);
        };
        $scope.starDashboard = function () {
            if ($scope.dashboardMeta.isStarred) {
                backendSrv.delete('/api/user/stars/dashboard/' + $scope.dashboard.id).then(function () {
                    $scope.dashboardMeta.isStarred = false;
                });
            }
            else {
                backendSrv.post('/api/user/stars/dashboard/' + $scope.dashboard.id).then(function () {
                    $scope.dashboardMeta.isStarred = true;
                });
            }
        };
        $scope.shareDashboard = function (tabIndex) {
            var modalScope = $scope.$new();
            modalScope.tabIndex = tabIndex;
            $scope.appEvent('show-modal', {
                src: 'public/app/features/dashboard/partials/shareModal.html',
                scope: modalScope
            });
        };
        $scope.quickSnapshot = function () {
            $scope.shareDashboard(1);
        };
        $scope.openSearch = function () {
            $scope.appEvent('show-dash-search');
        };
        $scope.hideTooltip = function (evt) {
            __WEBPACK_IMPORTED_MODULE_2_angular___default.a.element(evt.currentTarget).tooltip('hide');
            $scope.appEvent('hide-dash-search');
        };
        $scope.makeEditable = function () {
            $scope.dashboard.editable = true;
            var clone = $scope.dashboard.getSaveModelClone();
            backendSrv.saveDashboard(clone, { overwrite: false }).then(function (data) {
                $scope.dashboard.version = data.version;
                $scope.appEvent('dashboard-saved', $scope.dashboard);
                $scope.appEvent('alert-success', ['Dashboard saved', 'Saved as ' + clone.title]);
                // force refresh whole page
                window.location.href = window.location.href;
            }, $scope.handleSaveDashError);
        };
        $scope.saveDashboard = function (options) {
            if ($scope.dashboardMeta.canSave === false) {
                return;
            }
            if (!$scope.dashboard.system) {
                $scope.appEvent('alert-warning', [$translate.i18n.i18n_fail, $translate.i18n.i18n_input_full]);
                return;
            }
            if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isEmpty($scope.dashboard.title)) {
                $scope.appEvent('alert-warning', [$translate.i18n.i18n_fail, $translate.i18n.i18n_input_full]);
                return;
            }
            var clone = $scope.dashboard.getSaveModelClone();
            backendSrv.saveDashboard(clone, options).then(function (data) {
                $scope.dashboard.version = data.version;
                $scope.appEvent('dashboard-saved', $scope.dashboard);
                var dashboardUrl = '/dashboard/db/' + data.slug;
                if (dashboardUrl !== $location.path()) {
                    $location.url(dashboardUrl);
                }
                backendSrv.updateSystemId(clone.system);
                backendSrv.post("/api/dashboards/system", { DashId: data.id.toString(), SystemId: clone.system });
                $scope.appEvent('alert-success', [$translate.i18n.i18n_success, $translate.i18n.i18n_saveAs + clone.title]);
            }, $scope.handleSaveDashError);
        };
        $scope.handleSaveDashError = function (err) {
            if (err.data && err.data.status === "version-mismatch") {
                err.isHandled = true;
                $scope.appEvent('confirm-modal', {
                    title: '冲突',
                    text: '有人已经更新这仪表盘了',
                    text2: '您是否想直接覆盖并且保存您的操作',
                    yesText: "保存 & 覆盖",
                    icon: "fa-warning",
                    onConfirm: function () {
                        $scope.saveDashboard({ overwrite: true });
                    }
                });
            }
            if (err.data && err.data.status === "name-exists") {
                err.isHandled = true;
                $scope.appEvent('confirm-modal', {
                    title: $translate.i18n.i18n_confilct,
                    text: $translate.i18n.page_dash_save_name,
                    text2: $translate.i18n.page_dash_edit_name,
                    yesText: $translate.i18n.i18n_modify,
                    icon: "fa-warning"
                });
            }
        };
        $scope.deleteDashboard = function () {
            $scope.appEvent('confirm-modal', {
                title: $translate.i18n.i18n_delete,
                text: $translate.i18n.i18n_sure_operator,
                text2: $scope.dashboard.title,
                icon: 'fa-trash',
                yesText: $translate.i18n.i18n_delete,
                onConfirm: function () {
                    $scope.deleteDashboardConfirmed();
                }
            });
        };
        $scope.deleteDashboardConfirmed = function () {
            backendSrv.delete('/api/dashboards/db/' + $scope.dashboardMeta.slug).then(function () {
                $scope.appEvent('alert-success', ['Dashboard ', $scope.dashboard.title + ' Removed']);
                $location.url('/');
            });
        };
        $scope.saveDashboardAs = function () {
            var newScope = $rootScope.$new();
            newScope.clone = $scope.dashboard.getSaveModelClone();
            newScope.clone.editable = true;
            newScope.clone.hideControls = false;
            $scope.appEvent('show-modal', {
                src: 'public/app/features/dashboard/partials/saveDashboardAs.html',
                scope: newScope,
                modalClass: 'modal--narrow'
            });
        };
        $scope.exportDashboard = function () {
            var clone = $scope.dashboard.getSaveModelClone();
            clone.system = 0;
            var blob = new Blob([__WEBPACK_IMPORTED_MODULE_2_angular___default.a.toJson(clone, true)], { type: "application/json;charset=utf-8" });
            var wnd = window;
            wnd.saveAs(blob, $scope.dashboard.title + '-' + new Date().getTime() + '.json');
        };
        $scope.snapshot = function () {
            $scope.dashboard.snapshot = true;
            $rootScope.$broadcast('refresh');
            $timeout(function () {
                $scope.exportDashboard();
                $scope.dashboard.snapshot = false;
                $scope.appEvent('dashboard-snapshot-cleanup');
            }, 1000);
        };
        $scope.editJson = function () {
            var clone = $scope.dashboard.getSaveModelClone();
            $scope.appEvent('show-json-editor', { object: clone });
        };
        $scope.stopPlaylist = function () {
            playlistSrv.stop(1);
        };
        $scope.newDashboard = function () {
            $rootScope.appEvent('show-modal', {
                src: 'public/app/partials/select_system.html',
                scope: $scope.$new(),
            });
        };
        $scope.init();
    }
    return DashNavCtrl;
}());

function dashNavDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/features/dashboard/dashnav/dashnav.html',
        controller: DashNavCtrl,
        transclude: true,
    };
}
__WEBPACK_IMPORTED_MODULE_2_angular___default.a.module('grafana.directives').directive('dashnav', dashNavDirective);


/***/ }),

/***/ 1191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubmenuCtrl", function() { return SubmenuCtrl; });
/* harmony export (immutable) */ __webpack_exports__["submenuDirective"] = submenuDirective;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
///<reference path="../../../headers/common.d.ts" />

var SubmenuCtrl = /** @class */ (function () {
    /** @ngInject */
    function SubmenuCtrl($rootScope, templateValuesSrv, dynamicDashboardSrv, $scope) {
        this.$rootScope = $rootScope;
        this.templateValuesSrv = templateValuesSrv;
        this.dynamicDashboardSrv = dynamicDashboardSrv;
        this.$scope = $scope;
        this.annotations = $rootScope.mainScope.dashboard.templating.list;
        this.variables = $rootScope.mainScope.dashboard.templating.list;
    }
    SubmenuCtrl.prototype.disableAnnotation = function (annotation) {
        annotation.enable = !annotation.enable;
        this.$rootScope.$broadcast('refresh');
    };
    SubmenuCtrl.prototype.getValuesForTag = function (variable, tagKey) {
        return this.templateValuesSrv.getValuesForTag(variable, tagKey);
    };
    SubmenuCtrl.prototype.variableUpdated = function (variable) {
        var _this = this;
        this.templateValuesSrv.variableUpdated(variable).then(function () {
            _this.dynamicDashboardSrv.update(_this.dashboard);
            _this.$rootScope.$emit('template-variable-value-updated');
            _this.$rootScope.$broadcast('refresh');
        });
    };
    return SubmenuCtrl;
}());

function submenuDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/features/dashboard/submenu/submenu.html',
        controller: SubmenuCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            dashboard: "=",
        }
    };
}
__WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('grafana.directives').directive('dashboardSubmenu', submenuDirective);


/***/ }),

/***/ 1192:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('SaveDashboardAsCtrl', function($scope, backendSrv, $location, $translate) {

    $scope.init = function() {
      $scope.clone.id = null;
      $scope.clone.editable = true;
      $scope.clone.title = $scope.clone.title + " Copy";
    };

    function saveDashboard(options) {
      return backendSrv.saveDashboard($scope.clone, options).then(function(result) {
        $scope.appEvent('alert-success', [$translate.i18n.i18n_success, $translate.i18n.i18n_saveAs + ' ' + $scope.clone.title]);

        $location.url('/dashboard/db/' + result.slug);

        $scope.appEvent('dashboard-saved', $scope.clone);
        backendSrv.updateSystemId(clone.system);
        backendSrv.post("/api/dashboards/system", {DashId: result.id.toString(), SystemId: clone.system});
        $scope.dismiss();
      });
    }

    $scope.keyDown = function (evt) {
      if (evt.keyCode === 13) {
        $scope.saveClone();
      }
    };

    $scope.saveClone = function() {
      saveDashboard({overwrite: false}).then(null, function(err) {
        if (err.data && err.data.status === "name-exists") {
          err.isHandled = true;

          $scope.appEvent('confirm-modal', {
            title: $translate.i18n.page_dash_save_name,
            text: $translate.i18n.page_dash_override_tip,
            yesText: $translate.i18n.i18n_save_override,
            icon: "fa-warning",
            onConfirm: function() {
              saveDashboard({overwrite: true});
            }
          });
        }
      });
    };
  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1193:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(24)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, config) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('RowCtrl', function($scope, $rootScope, $timeout) {
    var _d = {
      title: "Row",
      height: "150px",
      collapse: false,
      editable: true,
      panels: [],
    };

    _.defaults($scope.row,_d);

    $scope.correlationThreshold = 100;

    $scope.init = function() {
      $scope.editor = {index: 0};
    };

    $scope.togglePanelMenu = function(posX) {
      $scope.showPanelMenu = !$scope.showPanelMenu;
      $scope.panelMenuPos = posX;
    };

    $scope.toggleRow = function(row) {
      row.collapse = row.collapse ? false : true;
    };

    $scope.addPanel = function(panel) {
      $scope.dashboard.addPanel(panel, $scope.row);
    };

    $scope.deleteRow = function() {
      function delete_row() {
        $scope.dashboard.rows = _.without($scope.dashboard.rows, $scope.row);
      }

      if (!$scope.row.panels.length) {
        delete_row();
        return;
      }

      $scope.appEvent('confirm-modal', {
        title: 'Delete',
        text: '您是否想删除整行',
        icon: 'fa-trash',
        yesText: 'Delete',
        onConfirm: function() {
          delete_row();
        }
      });
    };

    $scope.editRow = function() {
      $scope.appEvent('show-dash-editor', {
        src: 'public/app/partials/roweditor.html',
        scope: $scope.$new()
      });
    };

    $scope.moveRow = function(direction) {
      var rowsList = $scope.dashboard.rows;
      var rowIndex = _.indexOf(rowsList, $scope.row);
      var newIndex = rowIndex;
      switch(direction) {
        case 'up': {
          newIndex = rowIndex - 1;
          break;
        }
        case 'down': {
          newIndex = rowIndex + 1;
          break;
        }
        case 'top': {
          newIndex = 0;
          break;
        }
        case 'bottom': {
          newIndex = rowsList.length - 1;
          break;
        }
        default: {
          newIndex = rowIndex;
        }
      }
      if (newIndex >= 0 && newIndex <= (rowsList.length - 1)) {
        _.move(rowsList, rowIndex, newIndex);
      }
    };

    $scope.addPanelDefault = function(type) {
      var defaultSpan = 12;
      var _as = 12 - $scope.dashboard.rowSpan($scope.row);

      var panel = {
        title: config.new_panel_title,
        error: false,
        span: _as < defaultSpan && _as > 0 ? _as : defaultSpan,
        editable: true,
        type: type,
        isNew: true,
      };

      $scope.addPanel(panel);

      $timeout(function() {
        $scope.dashboardViewState.update({fullscreen: true, edit: true, panelId: panel.id });
      });
    };

    $scope.setHeight = function(height) {
      $scope.row.height = height;
      $scope.$broadcast('render');
    };

    $scope.init();
  });

  module.directive('rowHeight', function() {
    return function(scope, element) {
      scope.$watchGroup(['row.collapse', 'row.height'], function() {
        element.css({ minHeight: scope.row.collapse ? '5px' : scope.row.height });
      });

      scope.onAppEvent('panel-fullscreen-enter', function(evt, info) {
        var hasPanel = _.findWhere(scope.row.panels, {id: info.panelId});
        if (!hasPanel) {
          element.hide();
        }
      });

      scope.onAppEvent('panel-fullscreen-exit', function() {
        element.show();
      });
    };
  });

  module.directive('panelWidth', function() {
    return function(scope, element) {
      function updateWidth() {
        element[0].style.width = ((scope.panel.span / 1.2) * 10) + '%';
      }

      scope.onAppEvent('panel-fullscreen-enter', function(evt, info) {
        if (scope.panel.id !== info.panelId) {
          element.hide();
        } else {
          element[0].style.width = '100%';
        }
      });

      scope.onAppEvent('panel-fullscreen-exit', function(evt, info) {
        if (scope.panel.id !== info.panelId) {
          element.show();
        } else {
          updateWidth();
        }
      });

      scope.$watch('panel.span', updateWidth);
    };
  });

  module.directive('panelDropZone', function() {
    return function(scope, element) {
      scope.$on("ANGULAR_DRAG_START", function() {
        var dropZoneSpan = 12 - scope.dashboard.rowSpan(scope.row);

        if (dropZoneSpan > 0) {
          element.find('.panel-container').css('height', scope.row.height);
          element[0].style.width = ((dropZoneSpan / 1.2) * 10) + '%';
          element.show();
        }
      });

      scope.$on("ANGULAR_DRAG_END", function() {
        element.hide();
      });
    };
  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1194:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__,
  __webpack_require__(24),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, require, config) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('ShareModalCtrl', function($scope, $rootScope, $location, $timeout, timeSrv, $element, templateSrv, linkSrv, contextSrv) {

    $scope.options = { forCurrent: true, includeTemplateVars: true, theme: 'current' };
    $scope.editor = { index: $scope.tabIndex || 0};

    $scope.init = function() {
      $scope.modeSharePanel = $scope.panel ? true : false;

      $scope.tabs = [{title: '链接', src: 'shareLink.html'}];

      if ($scope.modeSharePanel) {
        $scope.modalTitle = 'Share Panel';
        $scope.tabs.push({title: '嵌入代码', src: 'shareEmbed.html'});
      } else {
        $scope.modalTitle = 'Share Dashboard';
      }

      if (!$scope.dashboard.meta.isSnapshot) {
        $scope.tabs.push({title: '生成快照', src: 'shareSnapshot.html'});
      }

      $scope.buildUrl();
    };

    $scope.buildUrl = function() {
      var baseUrl = $location.absUrl();
      var queryStart = baseUrl.indexOf('?');

      if (queryStart !== -1) {
        baseUrl = baseUrl.substring(0, queryStart);
      }

      var params = angular.copy($location.search());
      params.systemId = contextSrv.user.systemId;

      var range = timeSrv.timeRange();
      params.from = range.from.valueOf();
      params.to = range.to.valueOf();

      if ($scope.options.includeTemplateVars) {
        templateSrv.fillVariableValuesForUrl(params);
      }

      if (!$scope.options.forCurrent) {
        delete params.from;
        delete params.to;
      }

      if ($scope.options.theme !== 'current') {
        params.theme = $scope.options.theme;
      }

      if ($scope.modeSharePanel) {
        params.panelId = $scope.panel.id;
        params.fullscreen = true;
      } else {
        delete params.panelId;
        delete params.fullscreen;
      }

      $scope.shareUrl = linkSrv.addParamsToUrl(baseUrl, params);

      var soloUrl = $scope.shareUrl;
      soloUrl = soloUrl.replace('/dashboard/', '/dashboard-solo/');
      soloUrl = soloUrl.replace("&fullscreen", "");

      $scope.iframeHtml = '<iframe src="' + soloUrl + '" width="450" height="200" frameborder="0"></iframe>';

      $scope.imageUrl = soloUrl.replace('/dashboard-solo/', '/render/dashboard-solo/');
      $scope.imageUrl += '&width=1000';
      $scope.imageUrl += '&height=500';
    };

  });

  module.directive('clipboardButton',function() {
    return function(scope, elem) {
      __webpack_require__.e/* require */(6).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(1195)]; ((function(ZeroClipboard) {
        ZeroClipboard.config({
          swfPath: config.appSubUrl + '/public/vendor/zero_clipboard.swf'
        });
        new ZeroClipboard(elem[0]);
      }).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}).catch(__webpack_require__.oe);
    };
  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1196:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('ShareSnapshotCtrl', function($scope, $rootScope, $location, backendSrv, $timeout, timeSrv) {

    $scope.snapshot = {
      name: $scope.dashboard.title,
      expires: 0,
    };

    $scope.step = 1;

    $scope.expireOptions = [
      {text: '1 小时', value: 60*60},
      {text: '1 天',  value: 60*60*24},
      {text: '7 天', value: 60*60*24*7},
      {text: '永久',  value: 0},
    ];

    $scope.accessOptions = [
      {text: '任何获取到链接的用户', value: 1},
      {text: '公司用户',  value: 2},
      {text: '公开发布', value: 3},
    ];

    $scope.init = function() {
      backendSrv.get('/api/snapshot/shared-options').then(function(options) {
        $scope.externalUrl = options['externalSnapshotURL'];
        $scope.sharingButtonText = options['externalSnapshotName'];
        $scope.externalEnabled = options['externalEnabled'];
      });
    };

    $scope.apiUrl = '/api/snapshots';

    $scope.createSnapshot = function(external) {
      $scope.dashboard.snapshot = {
        timestamp: new Date()
      };

      $scope.loading = true;
      $scope.snapshot.external = external;

      $rootScope.$broadcast('refresh');

      $timeout(function() {
        $scope.saveSnapshot(external);
      }, 4000);
    };

    $scope.saveSnapshot = function(external) {
      var dash = $scope.dashboard.getSaveModelClone();
      $scope.scrubDashboard(dash);

      var cmdData = {
        dashboard: dash,
        name: dash.title,
        expires: $scope.snapshot.expires,
      };

      var postUrl = external ? $scope.externalUrl + $scope.apiUrl : $scope.apiUrl;

      backendSrv.post(postUrl, cmdData).then(function(results) {
        $scope.loading = false;

        if (external) {
          $scope.deleteUrl = results.deleteUrl;
          $scope.snapshotUrl = results.url;
          $scope.saveExternalSnapshotRef(cmdData, results);
        } else {
          var url = $location.url();
          var baseUrl = $location.absUrl();

          if (url !== '/') {
            baseUrl = baseUrl.replace(url, '') + '/';
          }

          $scope.snapshotUrl = baseUrl + 'dashboard/snapshot/' + results.key;
          $scope.deleteUrl = baseUrl + 'api/snapshots-delete/' + results.deleteKey;
        }

        $scope.step = 2;
      }, function() {
        $scope.loading = false;
      });
    };

    $scope.scrubDashboard = function(dash) {
      // change title
      dash.title = $scope.snapshot.name;
      // make relative times absolute
      dash.time = timeSrv.timeRange();
      // remove panel queries & links
      dash.forEachPanel(function(panel) {
        panel.targets = [];
        panel.links = [];
        panel.datasource = null;
      });
      // remove annotation queries
      dash.annotations.list = _.chain(dash.annotations.list)
      .filter(function(annotation) {
        return annotation.enable;
      })
      .map(function(annotation) {
        return {
          name: annotation.name,
          enable: annotation.enable,
          snapshotData: annotation.snapshotData
        };
      }).value();
      // remove template queries
      _.each(dash.templating.list, function(variable) {
        variable.query = "";
        variable.options = variable.current;
        variable.refresh = false;
      });

      // snapshot single panel
      if ($scope.modeSharePanel) {
        var singlePanel = dash.getPanelById($scope.panel.id);
        singlePanel.span = 12;
        dash.rows = [{ height: '500px', span: 12, panels: [singlePanel] }];
      }

      // cleanup snapshotData
      delete $scope.dashboard.snapshot;
      $scope.dashboard.forEachPanel(function(panel) {
        delete panel.snapshotData;
      });
      _.each($scope.dashboard.annotations.list, function(annotation) {
        delete annotation.snapshotData;
      });
    };

    $scope.deleteSnapshot = function() {
      backendSrv.get($scope.deleteUrl).then(function() {
        $scope.step = 3;
      });
    };

    $scope.saveExternalSnapshotRef = function(cmdData, results) {
      // save external in local instance as well
      cmdData.external = true;
      cmdData.key = results.key;
      cmdData.deleteKey = results.deleteKey;
      backendSrv.post('/api/snapshots/', cmdData);
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1197:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(16),
  __webpack_require__(3),
  __webpack_require__(1),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, $, _, moment) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('dashboardSrv', function(contextSrv, alertSrv)  {

    function DashboardModel (data, meta) {
      if (!data) {
        data = {};
      }

      if (!data.id && data.version) {
        data.schemaVersion = data.version;
      }

      this.id = data.id || null;
      this.title = data.title || 'No Title';
      this.system = data.system || null;
      this.manualAnnotation = data.manualAnnotation || null;
      this.originalTitle = this.title;
      this.tags = data.tags || [];
      this.style = data.style || "dark";
      this.timezone = data.timezone || '';
      this.editable = data.editable !== false;
      this.hideControls = data.hideControls || false;
      this.sharedCrosshair = data.sharedCrosshair || false;
      this.rows = data.rows || [];
      this.time = data.time || { from: 'now-6h', to: 'now' };
      this.timepicker = data.timepicker || {};
      this.templating = this._ensureListExist(data.templating);
      this.annotations = this._ensureListExist(data.annotations);
      this.refresh = data.refresh;
      this.snapshot = data.snapshot;
      this.schemaVersion = data.schemaVersion || 0;
      this.version = data.version || 0;
      this.links = data.links || [];
      this._updateSchema(data);
      this._initMeta(meta);
    }

    var p = DashboardModel.prototype;

    p._initMeta = function(meta) {
      meta = meta || {};

      meta.canShare = meta.canShare !== false;
      meta.canSave = meta.canSave !== false;
      meta.canStar = meta.canStar !== false;
      meta.canEdit = meta.canEdit !== false;

      if (!this.editable) {
        meta.canEdit = false;
        meta.canDelete = false;
        meta.canSave = false;
        this.hideControls = true;
      }

      this.meta = meta;
    };

    // cleans meta data and other non peristent state
    p.getSaveModelClone = function() {
      var copy = angular.copy(this);
      delete copy.meta;
      return copy;
    };

    p._ensureListExist = function (data) {
      if (!data) { data = {}; }
      if (!data.list) { data.list = []; }
      return data;
    };

    p.getNextPanelId = function() {
      var i, j, row, panel, max = 0;
      for (i = 0; i < this.rows.length; i++) {
        row = this.rows[i];
        for (j = 0; j < row.panels.length; j++) {
          panel = row.panels[j];
          if (panel.id > max) { max = panel.id; }
        }
      }
      return max + 1;
    };

    p.forEachPanel = function(callback) {
      var i, j, row;
      for (i = 0; i < this.rows.length; i++) {
        row = this.rows[i];
        for (j = 0; j < row.panels.length; j++) {
          callback(row.panels[j], j, row, i);
        }
      }
    };

    p.getPanelById = function(id) {
      for (var i = 0; i < this.rows.length; i++) {
        var row = this.rows[i];
        for (var j = 0; j < row.panels.length; j++) {
          var panel = row.panels[j];
          if (panel.id === id) {
            return panel;
          }
        }
      }
      return null;
    };

    p.rowSpan = function(row) {
      return _.reduce(row.panels, function(p,v) {
        return p + v.span;
      },0);
    };

    p.addPanel = function(panel, row) {
      var rowSpan = this.rowSpan(row);
      var panelCount = row.panels.length;
      var space = (12 - rowSpan) - panel.span;
      panel.id = this.getNextPanelId();

      // try to make room of there is no space left
      if (space <= 0) {
        if (panelCount === 1) {
          row.panels[0].span = 6;
          panel.span = 6;
        }
        else if (panelCount === 2) {
          row.panels[0].span = 4;
          row.panels[1].span = 4;
          panel.span = 4;
        }
      }

      row.panels.push(panel);
    };

    p.isSubmenuFeaturesEnabled = function() {
      var visableTemplates = _.filter(this.templating.list, function(template) {
        return template.hideVariable === undefined || template.hideVariable === false;
      });

      return visableTemplates.length > 0 || this.annotations.list.length > 0 || this.links.length > 0;
    };

    p.getPanelInfoById = function(panelId) {
      var result = {};
      _.each(this.rows, function(row) {
        _.each(row.panels, function(panel, index) {
          if (panel.id === panelId) {
            result.panel = panel;
            result.row = row;
            result.index = index;
          }
        });
      });

      if (!result.panel) {
        return null;
      }

      return result;
    };

    p.duplicatePanel = function(panel, row) {
      var rowIndex = _.indexOf(this.rows, row);
      var newPanel = angular.copy(panel);
      newPanel.id = this.getNextPanelId();

      delete newPanel.repeat;
      delete newPanel.repeatIteration;
      delete newPanel.repeatPanelId;
      delete newPanel.scopedVars;

      var currentRow = this.rows[rowIndex];
      currentRow.panels.push(newPanel);
      return newPanel;
    };

    p.formatDate = function(date, format) {
      date = moment.isMoment(date) ? date : moment(date);
      format = format || 'YYYY-MM-DD HH:mm:ss';
      this.timezone = this.getTimezone();

      return this.timezone === 'browser' ?
        moment(date).format(format) :
        moment.utc(date).format(format);
    };

    p.getRelativeTime = function(date) {
      date = moment.isMoment(date) ? date : moment(date);

      return this.timezone === 'browser' ?
        moment(date).fromNow() :
        moment.utc(date).fromNow();
    };

    p.getNextQueryLetter = function(panel) {
      var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      return _.find(letters, function(refId) {
        return _.every(panel.targets, function(other) {
          return other.refId !== refId;
        });
      });
    };

    p.isTimezoneUtc = function() {
      return this.getTimezone() === 'utc';
    };

    p.getTimezone = function() {
      return this.timezone ? this.timezone : contextSrv.user.timezone;
    };

    p._updateSchema = function(old) {
      var i, j, k;
      var oldVersion = this.schemaVersion;
      var panelUpgrades = [];
      this.schemaVersion = 12;

      if (oldVersion === this.schemaVersion) {
        return;
      }

      // version 2 schema changes
      if (oldVersion < 2) {

        if (old.services) {
          if (old.services.filter) {
            this.time = old.services.filter.time;
            this.templating.list = old.services.filter.list || [];
          }
          delete this.services;
        }

        panelUpgrades.push(function(panel) {
          // rename panel type
          if (panel.type === 'graphite') {
            panel.type = 'graph';
          }

          if (panel.type !== 'graph') {
            return;
          }

          if (_.isBoolean(panel.legend)) { panel.legend = { show: panel.legend }; }

          if (panel.grid) {
            if (panel.grid.min) {
              panel.grid.leftMin = panel.grid.min;
              delete panel.grid.min;
            }

            if (panel.grid.max) {
              panel.grid.leftMax = panel.grid.max;
              delete panel.grid.max;
            }
          }

          if (panel.y_format) {
            panel.y_formats[0] = panel.y_format;
            delete panel.y_format;
          }

          if (panel.y2_format) {
            panel.y_formats[1] = panel.y2_format;
            delete panel.y2_format;
          }
        });
      }

      // schema version 3 changes
      if (oldVersion < 3) {
        // ensure panel ids
        var maxId = this.getNextPanelId();
        panelUpgrades.push(function(panel) {
          if (!panel.id) {
            panel.id = maxId;
            maxId += 1;
          }
        });
      }

      // schema version 4 changes
      if (oldVersion < 4) {
        // move aliasYAxis changes
        panelUpgrades.push(function(panel) {
          if (panel.type !== 'graph') { return; }
          _.each(panel.aliasYAxis, function(value, key) {
            panel.seriesOverrides = [{ alias: key, yaxis: value }];
          });
          delete panel.aliasYAxis;
        });
      }

      if (oldVersion < 6) {
        // move pulldowns to new schema
        var annotations = _.findWhere(old.pulldowns, { type: 'annotations' });

        if (annotations) {
          this.annotations = {
            list: annotations.annotations || [],
          };
        }

        // update template variables
        for (i = 0 ; i < this.templating.list.length; i++) {
          var variable = this.templating.list[i];
          if (variable.datasource === void 0) { variable.datasource = null; }
          if (variable.type === 'filter') { variable.type = 'query'; }
          if (variable.type === void 0) { variable.type = 'query'; }
          if (variable.allFormat === void 0) { variable.allFormat = 'glob'; }
        }
      }

      if (oldVersion < 7) {
        if (old.nav && old.nav.length) {
          this.timepicker = old.nav[0];
          delete this.nav;
        }

        // ensure query refIds
        panelUpgrades.push(function(panel) {
          _.each(panel.targets, function(target) {
            if (!target.refId) {
              target.refId = p.getNextQueryLetter(panel);
            }
          }, this);
        });
      }

      if (oldVersion < 8) {
        panelUpgrades.push(function(panel) {
          _.each(panel.targets, function(target) {
            // update old influxdb query schema
            if (target.fields && target.tags && target.groupBy) {
              if (target.rawQuery) {
                delete target.fields;
                delete target.fill;
              } else {
                target.select = _.map(target.fields, function(field) {
                  var parts = [];
                  parts.push({type: 'field', params: [field.name]});
                  parts.push({type: field.func, params: []});
                  if (field.mathExpr) {
                    parts.push({type: 'math', params: [field.mathExpr]});
                  }
                  if (field.asExpr) {
                    parts.push({type: 'alias', params: [field.asExpr]});
                  }
                  return parts;
                });
                delete target.fields;
                _.each(target.groupBy, function(part) {
                  if (part.type === 'time' && part.interval)  {
                    part.params = [part.interval];
                    delete part.interval;
                  }
                  if (part.type === 'tag' && part.key) {
                    part.params = [part.key];
                    delete part.key;
                  }
                });

                if (target.fill) {
                  target.groupBy.push({type: 'fill', params: [target.fill]});
                  delete target.fill;
                }
              }
            }
          });
        });
      }

      // schema version 9 changes
      if (oldVersion < 9) {
        // move aliasYAxis changes
        panelUpgrades.push(function(panel) {
          if (panel.type !== 'singlestat' && panel.thresholds !== "") { return; }

          if (panel.thresholds) {
            var k = panel.thresholds.split(",");

            if (k.length >= 3) {
              k.shift();
              panel.thresholds = k.join(",");
            }
          }
        });
      }

      // schema version 10 changes
      if (oldVersion < 10) {
        // move aliasYAxis changes
        panelUpgrades.push(function(panel) {
          if (panel.type !== 'table') { return; }

          _.each(panel.styles, function(style) {
            if (style.thresholds && style.thresholds.length >= 3) {
              var k = style.thresholds;
              k.shift();
              style.thresholds = k;
            }
          });
        });
      }

      if (oldVersion < 12) {
        // update template variables
        _.each(this.templating.list, function(templateVariable) {
          if (templateVariable.refresh) { templateVariable.refresh = 1; }
          if (!templateVariable.refresh) { templateVariable.refresh = 0; }
          if (templateVariable.hideVariable) {
            templateVariable.hide = 2;
          } else if (templateVariable.hideLabel) {
            templateVariable.hide = 1;
          } else {
            templateVariable.hide = 0;
          }
        });
      }

      if (oldVersion < 12) {
        // update graph yaxes changes
        panelUpgrades.push(function(panel) {
          if (panel.type !== 'graph') { return; }
          if (!panel.grid) { return; }

          if (!panel.yaxes) {
            panel.yaxes = [
              {
                show: panel['y-axis'],
                min: panel.grid.leftMin,
                max: panel.grid.leftMax,
                logBase: panel.grid.leftLogBase,
                format: panel.y_formats[0],
                label: panel.leftYAxisLabel,
              },
              {
                show: panel['y-axis'],
                min: panel.grid.rightMin,
                max: panel.grid.rightMax,
                logBase: panel.grid.rightLogBase,
                format: panel.y_formats[1],
                label: panel.rightYAxisLabel,
              }
            ];

            panel.xaxis = {
              show: panel['x-axis'],
            };

            delete panel.grid.leftMin;
            delete panel.grid.leftMax;
            delete panel.grid.leftLogBase;
            delete panel.grid.rightMin;
            delete panel.grid.rightMax;
            delete panel.grid.rightLogBase;
            delete panel.y_formats;
            delete panel.leftYAxisLabel;
            delete panel.rightYAxisLabel;
            delete panel['y-axis'];
            delete panel['x-axis'];
          }
        });
      }

      if (panelUpgrades.length === 0) {
        return;
      }

      for (i = 0; i < this.rows.length; i++) {
        var row = this.rows[i];
        for (j = 0; j < row.panels.length; j++) {
          for (k = 0; k < panelUpgrades.length; k++) {
            panelUpgrades[k].call(this, row.panels[j]);
          }
        }
      }
    };

    return {
      create: function(dashboard, meta) {
        return new DashboardModel(dashboard, meta);
      },
      setCurrent: function(dashboard) {
        this.currentDashboard = dashboard;
      },
      getCurrent: function() {
        return this.currentDashboard;
      },
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1198:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(1),
  __webpack_require__(3),
  __webpack_require__(16),
  __webpack_require__(93),
  __webpack_require__(128),
  __webpack_require__(1172),
  __webpack_require__(24),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, moment, _, $, kbn, dateMath, impressionStore) {
  'use strict';

  kbn = kbn.default;

  var module = angular.module('grafana.services');

  module.service('dashboardLoaderSrv', function(backendSrv,
                                                   dashboardSrv,
                                                   datasourceSrv,
                                                   $http, $q, $timeout,
                                                   contextSrv, $routeParams,
                                                   $rootScope) {
    var self = this;

    this._dashboardLoadFailed = function(title, snapshot) {
      snapshot = snapshot || false;
      return {
        meta: { canStar: false, isSnapshot: snapshot, canDelete: false, canSave: false, canEdit: false, dashboardNotFound: true },
        dashboard: {title: title }
      };
    };

    this.loadDashboard = function(type, slug) {
      var promise;

      if (type === 'script') {
        promise = this._loadScriptedDashboard(slug);
      } else if (type === 'snapshot') {
        contextSrv.toggleSideMenu();
        promise = backendSrv.get('/api/snapshots/' + $routeParams.slug)
          .catch(function() {
            return self._dashboardLoadFailed("Snapshot not found", true);
          });
      } else {
        promise = backendSrv.getDashboard($routeParams.type, $routeParams.slug)
          .catch(function() {
            return self._dashboardLoadFailed("Not found");
          });
      }

      promise.then(function(result) {
        if (result.meta.dashboardNotFound !== true) {
          impressionStore.impressions.addDashboardImpression(result.dashboard.id);
        }

        return result;
      });

      return promise;
    };

    this._loadScriptedDashboard = function(file) {
      var url = 'public/dashboards/'+file.replace(/\.(?!js)/,"/") + '?' + new Date().getTime();

      return $http({ url: url, method: "GET" })
      .then(this._executeScript).then(function(result) {
        return { meta: { fromScript: true, canDelete: false, canSave: false, canStar: false}, dashboard: result.data };
      }, function(err) {
        console.log('Script dashboard error '+ err);
        $rootScope.appEvent('alert-error', ["脚本错误", "请确保它存在并返回一个有效的仪表盘"]);
        return self._dashboardLoadFailed('Scripted dashboard');
      });
    };

    this._executeScript = function(result) {
      var services = {
        dashboardSrv: dashboardSrv,
        datasourceSrv: datasourceSrv,
        $q: $q,
      };

      /*jshint -W054 */
      var script_func = new Function('ARGS','kbn','dateMath','_','moment','window','document','$','jQuery', 'services', result.data);
      var script_result = script_func($routeParams, kbn, dateMath, _ , moment, window, document, $, $, services);

      // Handle async dashboard scripts
      if (_.isFunction(script_result)) {
        var deferred = $q.defer();
        script_result(function(dashboard) {
          $timeout(function() {
            deferred.resolve({ data: dashboard });
          });
        });
        return deferred.promise;
      }

      return { data: script_result };
    };

  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1199:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(16),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, $) {
  'use strict';

  var module = angular.module('grafana.services');

  module.factory('dashboardViewStateSrv', function($location, $timeout) {

    // represents the transient view state
    // like fullscreen panel & edit
    function DashboardViewState($scope) {
      var self = this;
      self.state = {};
      self.panelScopes = [];
      self.$scope = $scope;
      self.dashboard = $scope.dashboard;

      $scope.exitFullscreen = function() {
        if (self.state.fullscreen) {
          self.update({ fullscreen: false });
        }
      };

      $scope.onAppEvent('$routeUpdate', function() {
        var urlState = self.getQueryStringState();
        if (self.needsSync(urlState)) {
          self.update(urlState, true);
        }
      });

      $scope.onAppEvent('panel-change-view', function(evt, payload) {
        self.update(payload);
      });

      $scope.onAppEvent('panel-initialized', function(evt, payload) {
        self.registerPanel(payload.scope);
      });

      this.update(this.getQueryStringState(), true);
      this.expandRowForPanel();
    }

    DashboardViewState.prototype.expandRowForPanel = function() {
      if (!this.state.panelId) { return; }

      var panelInfo = this.$scope.dashboard.getPanelInfoById(this.state.panelId);
      if (panelInfo) {
        panelInfo.row.collapse = false;
      }
    };

    DashboardViewState.prototype.needsSync = function(urlState) {
      return _.isEqual(this.state, urlState) === false;
    };

    DashboardViewState.prototype.getQueryStringState = function() {
      var state = $location.search();
      state.panelId = parseInt(state.panelId) || null;
      state.fullscreen = state.fullscreen ? true : null;
      state.edit =  (state.edit === "true" || state.edit === true) || null;
      state.editview = state.editview || null;
      return state;
    };

    DashboardViewState.prototype.serializeToUrl = function() {
      var urlState = _.clone(this.state);
      urlState.fullscreen = this.state.fullscreen ? true : null;
      urlState.edit = this.state.edit ? true : null;
      return urlState;
    };

    DashboardViewState.prototype.update = function(state, skipUrlSync) {
      _.extend(this.state, state);
      this.dashboard.meta.fullscreen = this.state.fullscreen;

      if (!this.state.fullscreen) {
        this.state.panelId = null;
        this.state.fullscreen = null;
        this.state.edit = null;
      }

      if (!skipUrlSync) {
        $location.search(this.serializeToUrl());
      }

      this.syncState();
    };

    DashboardViewState.prototype.syncState = function() {
      if (this.panelScopes.length === 0) { return; }

      if (this.dashboard.meta.fullscreen) {
        if (this.fullscreenPanel) {
          this.leaveFullscreen(false);
        }
        var panelScope = this.getPanelScope(this.state.panelId);
        // panel could be about to be created/added and scope does
        // not exist yet
        if (!panelScope) {
          return;
        }

        if (!panelScope.ctrl.editModeInitiated) {
          panelScope.ctrl.initEditMode();
        }

        this.enterFullscreen(panelScope);
        return;
      }

      if (this.fullscreenPanel) {
        this.leaveFullscreen(true);
      }
    };

    DashboardViewState.prototype.getPanelScope = function(id) {
      return _.find(this.panelScopes, function(panelScope) {
        return panelScope.ctrl.panel.id === id;
      });
    };

    DashboardViewState.prototype.leaveFullscreen = function(render) {
      var self = this;
      var ctrl = self.fullscreenPanel.ctrl;

      ctrl.editMode = false;
      ctrl.fullscreen = false;

      this.$scope.appEvent('panel-fullscreen-exit', {panelId: ctrl.panel.id});

      if (!render) { return false;}

      $timeout(function() {
        if (self.oldTimeRange !== ctrl.range) {
          self.$scope.broadcastRefresh();
        }
        else {
          ctrl.render();
        }
        delete self.fullscreenPanel;
      });
    };

    DashboardViewState.prototype.enterFullscreen = function(panelScope) {
      var ctrl = panelScope.ctrl;

      ctrl.editMode = this.state.edit && this.$scope.dashboardMeta.canEdit;
      ctrl.fullscreen = true;

      this.oldTimeRange = ctrl.range;
      this.fullscreenPanel = panelScope;

      $(window).scrollTop(0);

      this.$scope.appEvent('panel-fullscreen-enter', {panelId: ctrl.panel.id});

      $timeout(function() {
        ctrl.render();
      });
    };

    DashboardViewState.prototype.registerPanel = function(panelScope) {
      var self = this;
      self.panelScopes.push(panelScope);

      if (self.state.panelId === panelScope.ctrl.panel.id) {
        if (self.state.edit) {
          panelScope.ctrl.editPanel();
        } else {
          panelScope.ctrl.viewPanel();
        }
      }

      panelScope.$on('$destroy', function() {
        self.panelScopes = _.without(self.panelScopes, panelScope);
      });
    };

    return {
      create: function($scope) {
        return new DashboardViewState($scope);
      }
    };

  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1200:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(1),
  __webpack_require__(24),
  __webpack_require__(93),
  __webpack_require__(128)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, moment, config, kbn, dateMath) {
  'use strict';

  kbn = kbn.default;

  var module = angular.module('grafana.services');

  module.service('timeSrv', function($rootScope, $timeout, $routeParams, timer) {
    var self = this;

    this.init = function(dashboard) {
      timer.cancel_all();

      this.dashboard = dashboard;
      this.time = dashboard.time;

      this._initTimeFromUrl();
      this._parseTime();

      if(this.dashboard.refresh) {
        this.setAutoRefresh(this.dashboard.refresh);
      }
    };

    this._parseTime = function() {
      // when absolute time is saved in json it is turned to a string
      if (_.isString(this.time.from) && this.time.from.indexOf('Z') >= 0) {
        this.time.from = moment(this.time.from).utc();
      }
      if (_.isString(this.time.to) && this.time.to.indexOf('Z') >= 0) {
        this.time.to = moment(this.time.to).utc();
      }
    };

    this._parseUrlParam = function(value) {
      if (value.indexOf('now') !== -1) {
        return value;
      }
      if (value.length === 8) {
        return moment.utc(value, 'YYYYMMDD');
      }
      if (value.length === 15) {
        return moment.utc(value, 'YYYYMMDDTHHmmss');
      }

      if (!isNaN(value)) {
        var epoch = parseInt(value);
        return moment(epoch);
      }

      return null;
    };

    this._initTimeFromUrl = function() {
      if ($routeParams.from) {
        this.time.from = this._parseUrlParam($routeParams.from) || this.time.from;
      }
      if ($routeParams.to) {
        this.time.to = this._parseUrlParam($routeParams.to) || this.time.to;
      }
    };

    this.setAutoRefresh = function (interval) {
      this.dashboard.refresh = interval;
      if (interval) {
        var _i = kbn.interval_to_ms(interval);
        var wait_ms = _i - (Date.now() % _i);
        $timeout(function () {
          self.start_scheduled_refresh(_i);
          self.refreshDashboard();
        }, wait_ms);
      } else {
        this.cancel_scheduled_refresh();
      }
    };

    this.refreshDashboard = function() {
      $rootScope.$broadcast('refresh');
    };

    this.start_scheduled_refresh = function (after_ms) {
      self.cancel_scheduled_refresh();
      self.refresh_timer = timer.register($timeout(function () {
        self.start_scheduled_refresh(after_ms);
        self.refreshDashboard();
      }, after_ms));
    };

    this.cancel_scheduled_refresh = function () {
      timer.cancel(this.refresh_timer);
    };

    this.setTime = function(time, enableRefresh) {
      _.extend(this.time, time);

      // disable refresh if zoom in or zoom out
      if (!enableRefresh && moment.isMoment(time.to)) {
        this.old_refresh = this.dashboard.refresh || this.old_refresh;
        this.setAutoRefresh(false);
      }
      else if (this.old_refresh && this.old_refresh !== this.dashboard.refresh) {
        this.setAutoRefresh(this.old_refresh);
        this.old_refresh = null;
      }

      $rootScope.appEvent('time-range-changed', this.time);
      $timeout(this.refreshDashboard, 0);
    };

    this.timeRangeForUrl = function() {
      var range = this.timeRange(false);
      if (_.isString(range.to) && range.to.indexOf('now')) {
        range = this.timeRange();
      }

      if (moment.isMoment(range.from)) { range.from = range.from.valueOf(); }
      if (moment.isMoment(range.to)) { range.to = range.to.valueOf(); }

      return range;
    };

    this.timeRange = function(parse) {
      // make copies if they are moment  (do not want to return out internal moment, because they are mutable!)
      var from = moment.isMoment(this.time.from) ? moment(this.time.from) : this.time.from ;
      var to = moment.isMoment(this.time.to) ? moment(this.time.to) : this.time.to ;

      if (parse !== false) {
        from = dateMath.parse(from, false);
        to = dateMath.parse(to, true);
      }

      var range = {
        from: from,
        to:   to
      };

      return {from: from, to: to, raw: range};
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1201:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(angular, _) {
  'use strict';

  var module = angular.module('grafana.services');

  module.service('unsavedChangesSrv', function($rootScope, $q, $location, $timeout, contextSrv, $window) {

    function Tracker(dashboard, scope) {
      var self = this;

      this.original = dashboard.getSaveModelClone();
      this.current = dashboard;
      this.originalPath = $location.path();
      this.scope = scope;

      // register events
      scope.onAppEvent('dashboard-saved', function() {
        self.original = self.current.getSaveModelClone();
        self.originalPath = $location.path();
      });

      $window.onbeforeunload = function() {
        if (self.ignoreChanges()) { return; }
        if (self.hasChanges()) {
          return "您修改后的仪表盘尚未保存";
        }
      };

      scope.$on("$locationChangeStart", function(event, next) {
        // check if we should look for changes
        if (self.originalPath === $location.path()) { return true; }
        if (self.ignoreChanges()) { return true; }

        if (self.hasChanges()) {
          event.preventDefault();
          self.next = next;

          $timeout(function() {
            self.open_modal();
          });
        }
      });
    }

    var p = Tracker.prototype;

    // for some dashboards and users
    // changes should be ignored
    p.ignoreChanges = function() {
      if (!this.original) { return true; }
      if (!contextSrv.isEditor) { return true; }
      if (!this.current || !this.current.meta) { return true; }

      var meta = this.current.meta;
      return !meta.canSave || meta.fromScript || meta.fromFile;
    };

    // remove stuff that should not count in diff
    p.cleanDashboardFromIgnoredChanges = function(dash) {
      // ignore time and refresh
      dash.time = 0;
      dash.refresh = 0;
      dash.schemaVersion = 0;

      // filter row and panels properties that should be ignored
      dash.rows = _.filter(dash.rows, function(row) {
        if (row.repeatRowId) {
          return false;
        }

        row.panels = _.filter(row.panels, function(panel) {
          if (panel.repeatPanelId) {
            return false;
          }

          // remove scopedVars
          panel.scopedVars = null;

          // ignore span changes
          panel.span = null;

          // ignore panel legend sort
          if (panel.legend)  {
            delete panel.legend.sort;
            delete panel.legend.sortDesc;
          }

          return true;
        });

        // ignore collapse state
        row.collapse = false;
        return true;
      });

      // ignore template variable values
      _.each(dash.templating.list, function(value) {
        value.current = null;
        value.options = null;
      });
    };

    p.hasChanges = function() {
      var current = this.current.getSaveModelClone();
      var original = this.original;

      this.cleanDashboardFromIgnoredChanges(current);
      this.cleanDashboardFromIgnoredChanges(original);

      var currentTimepicker = _.findWhere(current.nav, { type: 'timepicker' });
      var originalTimepicker = _.findWhere(original.nav, { type: 'timepicker' });

      if (currentTimepicker && originalTimepicker) {
        currentTimepicker.now = originalTimepicker.now;
      }

      var currentJson = angular.toJson(current);
      var originalJson = angular.toJson(original);

      return currentJson !== originalJson;
    };

    p.open_modal = function() {
      var tracker = this;

      var modalScope = this.scope.$new();
      modalScope.ignore = function() {
        tracker.original = null;
        tracker.goto_next();
      };

      modalScope.save = function() {
        tracker.scope.$emit('save-dashboard');
      };

      $rootScope.appEvent('show-modal', {
        src: 'public/app/partials/unsaved-changes.html',
        modalClass: 'confirm-modal',
        scope: modalScope,
      });
    };

    p.goto_next = function() {
      var baseLen = $location.absUrl().length - $location.url().length;
      var nextUrl = this.next.substring(baseLen);
      $location.url(nextUrl);
    };

    this.Tracker = Tracker;
    this.init = function(dashboard, scope) {
      // wait for different services to patch the dashboard (missing properties)
      $timeout(function() { new Tracker(dashboard, scope); }, 1200);
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimePickerCtrl", function() { return TimePickerCtrl; });
/* harmony export (immutable) */ __webpack_exports__["settingsDirective"] = settingsDirective;
/* harmony export (immutable) */ __webpack_exports__["timePickerDirective"] = timePickerDirective;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_utils_rangeutil__ = __webpack_require__(455);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__input_date__ = __webpack_require__(1203);
///<reference path="../../../headers/common.d.ts" />




var TimePickerCtrl = /** @class */ (function () {
    /** @ngInject */
    function TimePickerCtrl($scope, $rootScope, timeSrv, $translate) {
        var _this = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.timeSrv = timeSrv;
        this.$translate = $translate;
        $scope.ctrl = this;
        $rootScope.onAppEvent('zoom-out', function () { return _this.zoom(2); }, $scope);
        $rootScope.onAppEvent('shift-time-forward', function () { return _this.move(1); }, $scope);
        $rootScope.onAppEvent('shift-time-backward', function () { return _this.move(-1); }, $scope);
        $rootScope.onAppEvent('refresh', function () { return _this.init(); }, $scope);
        $rootScope.onAppEvent('dash-editor-hidden', function () { return _this.isOpen = false; }, $scope);
        this.init();
    }
    TimePickerCtrl.prototype.init = function () {
        this.panel = this.dashboard.timepicker;
        __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.defaults(this.panel, TimePickerCtrl.defaults);
        var time = __WEBPACK_IMPORTED_MODULE_1_angular___default.a.copy(this.timeSrv.timeRange());
        var timeRaw = __WEBPACK_IMPORTED_MODULE_1_angular___default.a.copy(this.timeSrv.timeRange(false));
        if (!this.dashboard.isTimezoneUtc()) {
            time.from.local();
            time.to.local();
            if (__WEBPACK_IMPORTED_MODULE_2_moment___default.a.isMoment(timeRaw.from)) {
                timeRaw.from.local();
            }
            if (__WEBPACK_IMPORTED_MODULE_2_moment___default.a.isMoment(timeRaw.to)) {
                timeRaw.to.local();
            }
        }
        else {
            this.isUtc = true;
        }
        this.rangeString = __WEBPACK_IMPORTED_MODULE_3_app_core_utils_rangeutil__["describeTimeRange"](timeRaw);
        this.absolute = { fromJs: time.from.toDate(), toJs: time.to.toDate() };
        this.tooltip = this.dashboard.formatDate(time.from) + (" " + this.$translate.i18n.i18n_to + " ");
        this.tooltip += this.dashboard.formatDate(time.to);
        // do not update time raw when dropdown is open
        // as auto refresh will reset the from/to input fields
        if (!this.isOpen) {
            this.timeRaw = timeRaw;
        }
    };
    TimePickerCtrl.prototype.zoom = function (factor) {
        var range = this.timeSrv.timeRange();
        var timespan = (range.to.valueOf() - range.from.valueOf());
        var center = range.to.valueOf() - timespan / 2;
        var to = (center + (timespan * factor) / 2);
        var from = (center - (timespan * factor) / 2);
        if (to > Date.now() && range.to <= Date.now()) {
            var offset = to - Date.now();
            from = from - offset;
            to = Date.now();
        }
        this.timeSrv.setTime({ from: __WEBPACK_IMPORTED_MODULE_2_moment___default.a.utc(from), to: __WEBPACK_IMPORTED_MODULE_2_moment___default.a.utc(to) });
    };
    TimePickerCtrl.prototype.move = function (direction) {
        var range = this.timeSrv.timeRange();
        var timespan = (range.to.valueOf() - range.from.valueOf()) / 2;
        var to, from;
        if (direction === -1) {
            to = range.to.valueOf() - timespan;
            from = range.from.valueOf() - timespan;
        }
        else if (direction === 1) {
            to = range.to.valueOf() + timespan;
            from = range.from.valueOf() + timespan;
            if (to > Date.now() && range.to < Date.now()) {
                to = Date.now();
                from = range.from.valueOf();
            }
        }
        else {
            to = range.to.valueOf();
            from = range.from.valueOf();
        }
        this.timeSrv.setTime({ from: __WEBPACK_IMPORTED_MODULE_2_moment___default.a.utc(from), to: __WEBPACK_IMPORTED_MODULE_2_moment___default.a.utc(to) });
    };
    TimePickerCtrl.prototype.openDropdown = function () {
        this.init();
        this.isOpen = true;
        this.timeOptions = __WEBPACK_IMPORTED_MODULE_3_app_core_utils_rangeutil__["getRelativeTimesList"](this.panel, this.rangeString);
        this.refresh = {
            value: this.dashboard.refresh,
            options: __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.map(this.panel.refresh_intervals, function (interval) {
                return { text: interval, value: interval };
            })
        };
        this.refresh.options.unshift({ text: 'off' });
        this.$rootScope.appEvent('show-dash-editor', {
            src: 'public/app/features/dashboard/timepicker/dropdown.html',
            scope: this.$scope,
            cssClass: 'gf-timepicker-dropdown',
        });
    };
    TimePickerCtrl.prototype.applyCustom = function () {
        if (this.refresh.value !== this.dashboard.refresh) {
            this.timeSrv.setAutoRefresh(this.refresh.value);
        }
        this.timeSrv.setTime(this.timeRaw, true);
        this.$rootScope.appEvent('hide-dash-editor');
    };
    TimePickerCtrl.prototype.absoluteFromChanged = function () {
        this.timeRaw.from = this.getAbsoluteMomentForTimezone(this.absolute.fromJs);
    };
    TimePickerCtrl.prototype.absoluteToChanged = function () {
        this.timeRaw.to = this.getAbsoluteMomentForTimezone(this.absolute.toJs);
    };
    TimePickerCtrl.prototype.getAbsoluteMomentForTimezone = function (jsDate) {
        return this.dashboard.isTimezoneUtc() ? __WEBPACK_IMPORTED_MODULE_2_moment___default()(jsDate).utc() : __WEBPACK_IMPORTED_MODULE_2_moment___default()(jsDate);
    };
    TimePickerCtrl.prototype.setRelativeFilter = function (timespan) {
        var range = { from: timespan.from, to: timespan.to };
        if (this.panel.nowDelay && range.to === 'now') {
            range.to = 'now-' + this.panel.nowDelay;
        }
        this.timeSrv.setTime(range);
        this.$rootScope.appEvent('hide-dash-editor');
    };
    TimePickerCtrl.tooltipFormat = 'MMM D, YYYY HH:mm:ss';
    TimePickerCtrl.defaults = {
        time_options: ['5m', '15m', '1h', '6h', '12h', '24h', '2d', '7d', '30d'],
        refresh_intervals: ['5s', '10s', '30s', '1m', '5m', '15m', '30m', '1h', '2h', '1d'],
    };
    return TimePickerCtrl;
}());

function settingsDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/features/dashboard/timepicker/settings.html',
        controller: TimePickerCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            dashboard: "="
        }
    };
}
function timePickerDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/features/dashboard/timepicker/timepicker.html',
        controller: TimePickerCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            dashboard: "="
        }
    };
}
__WEBPACK_IMPORTED_MODULE_1_angular___default.a.module('grafana.directives').directive('gfTimePickerSettings', settingsDirective);
__WEBPACK_IMPORTED_MODULE_1_angular___default.a.module('grafana.directives').directive('gfTimePicker', timePickerDirective);

__WEBPACK_IMPORTED_MODULE_1_angular___default.a.module("grafana.directives").directive('inputDatetime', __WEBPACK_IMPORTED_MODULE_4__input_date__["a" /* inputDateDirective */]);


/***/ }),

/***/ 1203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = inputDateDirective;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_utils_datemath__ = __webpack_require__(128);
///<reference path="../../../headers/common.d.ts" />


function inputDateDirective() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, $elem, attrs, ngModel) {
            var format = 'YYYY-MM-DD HH:mm:ss';
            var fromUser = function (text) {
                if (text.indexOf('now') !== -1) {
                    if (!__WEBPACK_IMPORTED_MODULE_1_app_core_utils_datemath__["isValid"](text)) {
                        ngModel.$setValidity("error", false);
                        return undefined;
                    }
                    ngModel.$setValidity("error", true);
                    return text;
                }
                var parsed;
                if ($scope.ctrl.isUtc) {
                    parsed = __WEBPACK_IMPORTED_MODULE_0_moment___default.a.utc(text, format);
                }
                else {
                    parsed = __WEBPACK_IMPORTED_MODULE_0_moment___default()(text, format);
                }
                if (!parsed.isValid()) {
                    ngModel.$setValidity("error", false);
                    return undefined;
                }
                ngModel.$setValidity("error", true);
                return parsed;
            };
            var toUser = function (currentValue) {
                if (__WEBPACK_IMPORTED_MODULE_0_moment___default.a.isMoment(currentValue)) {
                    return currentValue.format(format);
                }
                else {
                    return currentValue;
                }
            };
            ngModel.$parsers.push(fromUser);
            ngModel.$formatters.push(toUser);
        }
    };
}


/***/ }),

/***/ 1204:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(93)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, kbn) {
  'use strict';

  kbn = kbn.default;

  var module = angular.module('grafana.controllers');

  module.controller('GraphiteImportCtrl', function($scope, datasourceSrv, dashboardSrv, $location) {
    $scope.options = {};

    $scope.init = function() {
      $scope.datasources = [];
      _.each(datasourceSrv.getAll(), function(ds) {
        if (ds.type === 'graphite') {
          $scope.options.sourceName = ds.name;
          $scope.datasources.push(ds.name);
        }
      });
    };

    $scope.listAll = function() {
      datasourceSrv.get($scope.options.sourceName).then(function(datasource) {
        $scope.datasource = datasource;
        $scope.datasource.listDashboards('').then(function(results) {
          $scope.dashboards = results;
        }, function(err) {
          var message = err.message || err.statusText || 'Error';
          $scope.appEvent('alert-error', ['Failed to load dashboard list from graphite', message]);
        });
      });
    };

    $scope.import = function(dashName) {
      $scope.datasource.loadDashboard(dashName).then(function(results) {
        if (!results.data || !results.data.state) {
          throw { message: 'no dashboard state received from graphite' };
        }

        graphiteToGrafanaTranslator(results.data.state, $scope.datasource.name);
      }, function(err) {
        var message = err.message || err.statusText || 'Error';
        $scope.appEvent('alert-error', ['Failed to load dashboard from graphite', message]);
      });
    };

    function graphiteToGrafanaTranslator(state, datasource) {
      var graphsPerRow = 2;
      var rowHeight = 300;
      var rowTemplate;
      var currentRow;
      var panel;

      rowTemplate = {
        title: '',
        panels: [],
        height: rowHeight
      };

      currentRow = angular.copy(rowTemplate);

      var newDashboard = dashboardSrv.create({});
      newDashboard.rows = [];
      newDashboard.title = state.name;
      newDashboard.rows.push(currentRow);

      _.each(state.graphs, function(graph, index) {
        if (currentRow.panels.length === graphsPerRow) {
          currentRow = angular.copy(rowTemplate);
          newDashboard.rows.push(currentRow);
        }

        panel = {
          type: 'graph',
          span: 12 / graphsPerRow,
          title: graph[1].title,
          targets: [],
          datasource: datasource,
          id: index + 1
        };

        _.each(graph[1].target, function(target) {
          panel.targets.push({ target: target });
        });

        currentRow.panels.push(panel);
      });

      window.grafanaImportDashboard = newDashboard;
      $location.path('/dashboard-import/' + kbn.slugifyForUrl(newDashboard.title));
    }
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1205:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _) {
  'use strict';

  var module = angular.module('grafana.services');

  module.service('dynamicDashboardSrv', function()  {
    var self = this;

    this.init = function(dashboard) {
      if (dashboard.snapshot) { return; }

      this.iteration = new Date().getTime();
      this.process(dashboard);
    };

    this.update = function(dashboard) {
      if (dashboard.snapshot) { return; }

      this.iteration = this.iteration + 1;
      this.process(dashboard);
    };

    this.process = function(dashboard) {
      if (dashboard.templating.list.length === 0) { return; }
      this.dashboard = dashboard;

      var i, j, row, panel;
      for (i = 0; i < this.dashboard.rows.length; i++) {
        row = this.dashboard.rows[i];
        // handle row repeats
        if (row.repeat) {
          this.repeatRow(row, i);
        }
        // clean up old left overs
        else if (row.repeatRowId && row.repeatIteration !== this.iteration) {
          this.dashboard.rows.splice(i, 1);
          i = i - 1;
          continue;
        }

        // repeat panels
        for (j = 0; j < row.panels.length; j++) {
          panel = row.panels[j];
          if (panel.repeat) {
            this.repeatPanel(panel, row);
          }
          // clean up old left overs
          else if (panel.repeatPanelId && panel.repeatIteration !== this.iteration) {
            row.panels = _.without(row.panels, panel);
            j = j - 1;
          } else if (!_.isEmpty(panel.scopedVars) && panel.repeatIteration !== this.iteration) {
            panel.scopedVars = {};
          }
        }
      }
    };

    // returns a new row clone or reuses a clone from previous iteration
    this.getRowClone = function(sourceRow, repeatIndex, sourceRowIndex) {
      if (repeatIndex === 0) {
        return sourceRow;
      }

      var i, panel, row, copy;
      var sourceRowId = sourceRowIndex + 1;

      // look for row to reuse
      for (i = 0; i < this.dashboard.rows.length; i++) {
        row = this.dashboard.rows[i];
        if (row.repeatRowId === sourceRowId && row.repeatIteration !== this.iteration) {
          copy = row;
          break;
        }
      }

      if (!copy) {
        copy = angular.copy(sourceRow);
        this.dashboard.rows.splice(sourceRowIndex + repeatIndex, 0, copy);

        // set new panel ids
        for (i = 0; i < copy.panels.length; i++) {
          panel = copy.panels[i];
          panel.id = this.dashboard.getNextPanelId();
        }
      }

      copy.repeat = null;
      copy.repeatRowId = sourceRowId;
      copy.repeatIteration = this.iteration;
      return copy;
    };

    // returns a new row clone or reuses a clone from previous iteration
    this.repeatRow = function(row, rowIndex) {
      var variables = this.dashboard.templating.list;
      var variable = _.findWhere(variables, {name: row.repeat});
      if (!variable) {
        return;
      }

      var selected, copy, i, panel;
      if (variable.current.text === 'All') {
        selected = variable.options.slice(1, variable.options.length);
      } else {
        selected = _.filter(variable.options, {selected: true});
      }

      _.each(selected, function(option, index) {
        copy = self.getRowClone(row, index, rowIndex);
        copy.scopedVars = {};
        copy.scopedVars[variable.name] = option;

        for (i = 0; i < copy.panels.length; i++) {
          panel = copy.panels[i];
          panel.scopedVars = {};
          panel.scopedVars[variable.name] = option;
          panel.repeatIteration = this.iteration;
        }
      }, this);
    };

    this.getPanelClone = function(sourcePanel, row, index) {
      // if first clone return source
      if (index === 0) {
        return sourcePanel;
      }

      var i, tmpId, panel, clone;

      // first try finding an existing clone to use
      for (i = 0; i < row.panels.length; i++) {
        panel = row.panels[i];
        if (panel.repeatIteration !== this.iteration && panel.repeatPanelId === sourcePanel.id) {
          clone = panel;
          break;
        }
      }

      if (!clone) {
        clone = { id: this.dashboard.getNextPanelId() };
        row.panels.push(clone);
      }

      // save id
      tmpId = clone.id;
      // copy properties from source
      angular.copy(sourcePanel, clone);
      // restore id
      clone.id = tmpId;
      clone.repeatIteration = this.iteration;
      clone.repeatPanelId = sourcePanel.id;
      clone.repeat = null;
      return clone;
    };

    this.repeatPanel = function(panel, row) {
      var variables = this.dashboard.templating.list;
      var variable = _.findWhere(variables, {name: panel.repeat});
      if (!variable) { return; }

      var selected;
      if (variable.current.text === 'All') {
        selected = variable.options.slice(1, variable.options.length);
      } else {
        selected = _.filter(variable.options, {selected: true});
      }

      _.each(selected, function(option, index) {
        var copy = self.getPanelClone(panel, row, index);
        copy.span = Math.max(12 / selected.length, panel.minSpan);
        copy.scopedVars = copy.scopedVars || {};
        copy.scopedVars[variable.name] = option;
      });
    };

  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1206:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('DashboardImportCtrl', function($scope, backendSrv, datasourceSrv) {

    $scope.init = function() {
      $scope.datasources = [];
      $scope.sourceName = 'grafana';
      $scope.destName = 'grafana';
      $scope.imported = [];
      $scope.dashboards = [];
      $scope.infoText = '';
      $scope.importing = false;

      _.each(datasourceSrv.getAll(), function(ds, key) {
        if (ds.type === 'influxdb_08' || ds.type === 'elasticsearch') {
          $scope.sourceName = key;
          $scope.datasources.push(key);
        }
      });
    };

    $scope.startImport = function() {
      datasourceSrv.get($scope.sourceName).then(function(ds) {
        $scope.dashboardSource = ds;
        $scope.dashboardSource.searchDashboards('title:').then(function(results) {
          $scope.dashboards = results.dashboards;

          if ($scope.dashboards.length === 0) {
            $scope.infoText = 'No dashboards found';
            return;
          }

          $scope.importing = true;
          $scope.imported = [];
          $scope.next();
        }, function(err) {
          var resp = err.message || err.statusText || 'Unknown error';
          var message = "Failed to load dashboards from selected data source, response from server was: " + resp;
          $scope.appEvent('alert-error', ['Import failed', message]);
        });
      });
    };

    $scope.next = function() {
      if ($scope.dashboards.length === 0) {
        $scope.infoText = "Done! Imported " + $scope.imported.length + " dashboards";
      }

      var dash = $scope.dashboards.shift();
      if (!dash.title) {
        console.log(dash);
        return;
      }

      var infoObj = {name: dash.title, info: 'Importing...'};
      $scope.imported.push(infoObj);
      $scope.infoText = "Importing " + $scope.imported.length + '/' + ($scope.imported.length + $scope.dashboards.length);

      $scope.dashboardSource.getDashboard(dash.id).then(function(loadedDash) {
        backendSrv.saveDashboard(loadedDash).then(function() {
          infoObj.info = "Done!";
          $scope.next();
        }, function(err) {
          err.isHandled = true;
          infoObj.info = "Error: " + (err.data || { message: 'Unknown' }).message;
          $scope.next();
        });
      });
    };

    $scope.init();

  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1207:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(1208),
  __webpack_require__(1209),
  __webpack_require__(1210),
  __webpack_require__(1211),
  __webpack_require__(1212)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlaylistsCtrl", function() { return PlaylistsCtrl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />


var PlaylistsCtrl = /** @class */ (function () {
    /** @ngInject */
    function PlaylistsCtrl($scope, $location, backendSrv) {
        var _this = this;
        this.$scope = $scope;
        this.$location = $location;
        this.backendSrv = backendSrv;
        backendSrv.get('/api/playlists')
            .then(function (result) {
            _this.playlists = result;
        });
    }
    PlaylistsCtrl.prototype.removePlaylistConfirmed = function (playlist) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.remove(this.playlists, { id: playlist.id });
        this.backendSrv.delete('/api/playlists/' + playlist.id)
            .then(function () {
            _this.$scope.appEvent('alert-success', ['Playlist deleted', '']);
        }, function () {
            _this.$scope.appEvent('alert-error', ['Unable to delete playlist', '']);
            _this.playlists.push(playlist);
        });
    };
    PlaylistsCtrl.prototype.removePlaylist = function (playlist) {
        var _this = this;
        this.$scope.appEvent('confirm-modal', {
            title: 'Delete',
            text: 'Are you sure you want to delete playlist ' + playlist.name + '?',
            yesText: "Delete",
            icon: "fa-trash",
            onConfirm: function () {
                _this.removePlaylistConfirmed(playlist);
            }
        });
    };
    return PlaylistsCtrl;
}());

__WEBPACK_IMPORTED_MODULE_1__core_core_module__["default"].controller('PlaylistsCtrl', PlaylistsCtrl);


/***/ }),

/***/ 1209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlaylistSearchCtrl", function() { return PlaylistSearchCtrl; });
/* harmony export (immutable) */ __webpack_exports__["playlistSearchDirective"] = playlistSearchDirective;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />

var PlaylistSearchCtrl = /** @class */ (function () {
    /** @ngInject */
    function PlaylistSearchCtrl($scope, $location, $timeout, backendSrv, contextSrv) {
        var _this = this;
        this.$scope = $scope;
        this.$location = $location;
        this.$timeout = $timeout;
        this.backendSrv = backendSrv;
        this.contextSrv = contextSrv;
        this.query = { query: '', tag: [], starred: false };
        $timeout(function () {
            _this.query.query = '';
            _this.searchDashboards();
        }, 100);
    }
    PlaylistSearchCtrl.prototype.searchDashboards = function () {
        this.tagsMode = false;
        var prom = {};
        prom.promise = this.backendSrv.search(this.query).then(function (result) {
            return {
                dashboardResult: result,
                tagResult: []
            };
        });
        this.searchStarted(prom);
    };
    PlaylistSearchCtrl.prototype.showStarred = function () {
        this.query.starred = !this.query.starred;
        this.searchDashboards();
    };
    PlaylistSearchCtrl.prototype.queryHasNoFilters = function () {
        return this.query.query === '' && this.query.starred === false && this.query.tag.length === 0;
    };
    PlaylistSearchCtrl.prototype.filterByTag = function (tag, evt) {
        this.query.tag.push(tag);
        this.searchDashboards();
        if (evt) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    };
    PlaylistSearchCtrl.prototype.getTags = function () {
        var prom = {};
        prom.promise = this.backendSrv.get('/api/dashboards/tags').then(function (result) {
            return {
                dashboardResult: [],
                tagResult: result
            };
        });
        this.searchStarted(prom);
    };
    return PlaylistSearchCtrl;
}());

function playlistSearchDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/features/playlist/partials/playlist_search.html',
        controller: PlaylistSearchCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            searchStarted: '&'
        },
    };
}
__WEBPACK_IMPORTED_MODULE_0__core_core_module__["default"].directive('playlistSearch', playlistSearchDirective);


/***/ }),

/***/ 1210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_utils_kbn__ = __webpack_require__(93);
///<reference path="../../headers/common.d.ts" />



var PlaylistSrv = /** @class */ (function () {
    /** @ngInject */
    function PlaylistSrv($rootScope, $location, $timeout, backendSrv) {
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$timeout = $timeout;
        this.backendSrv = backendSrv;
    }
    PlaylistSrv.prototype.next = function () {
        var _this = this;
        this.$timeout.cancel(this.cancelPromise);
        var playedAllDashboards = this.index > this.dashboards.length - 1;
        if (playedAllDashboards) {
            window.location.href = __WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.appSubUrl + "/playlists/play/" + this.playlistId;
        }
        else {
            var dash = this.dashboards[this.index];
            this.$location.url('dashboard/' + dash.uri);
            this.index++;
            this.cancelPromise = this.$timeout(function () { return _this.next(); }, this.interval);
        }
    };
    PlaylistSrv.prototype.prev = function () {
        this.index = Math.max(this.index - 2, 0);
        this.next();
    };
    PlaylistSrv.prototype.start = function (playlistId) {
        var _this = this;
        this.stop();
        this.index = 0;
        this.playlistId = playlistId;
        this.$rootScope.playlistSrv = this;
        this.backendSrv.get("/api/playlists/" + playlistId).then(function (playlist) {
            _this.backendSrv.get("/api/playlists/" + playlistId + "/dashboards").then(function (dashboards) {
                _this.dashboards = dashboards;
                _this.interval = __WEBPACK_IMPORTED_MODULE_2_app_core_utils_kbn__["default"].interval_to_ms(playlist.interval);
                _this.next();
            });
        });
    };
    PlaylistSrv.prototype.stop = function () {
        this.index = 0;
        this.playlistId = 0;
        if (this.cancelPromise) {
            this.$timeout.cancel(this.cancelPromise);
        }
        this.$rootScope.playlistSrv = null;
    };
    return PlaylistSrv;
}());
__WEBPACK_IMPORTED_MODULE_1__core_core_module__["default"].service('playlistSrv', PlaylistSrv);


/***/ }),

/***/ 1211:
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Final loader didn't return a Buffer or String\n    at runLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/webpack/lib/NormalModule.js:204:46)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:370:3\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:211:10)\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:218:10)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:233:3\n    at context.callback (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),

/***/ 1212:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;  !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(24),
  __webpack_require__(3)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular) {
  'use strict';

  var module = angular.module('grafana.routes');

  module.config(function($routeProvider) {
    $routeProvider
      .when('/playlists', {
        templateUrl: 'public/app/features/playlist/partials/playlists.html',
        controllerAs: 'ctrl',
        controller : 'PlaylistsCtrl'
      })
      .when('/playlists/create', {
        templateUrl: 'public/app/features/playlist/partials/playlist.html',
        controllerAs: 'ctrl',
        controller : 'PlaylistEditCtrl'
      })
      .when('/playlists/edit/:id', {
        templateUrl: 'public/app/features/playlist/partials/playlist.html',
        controllerAs: 'ctrl',
        controller : 'PlaylistEditCtrl'
      })
      .when('/playlists/play/:id', {
        templateUrl: 'public/app/features/playlist/partials/playlists.html',
        controllerAs: 'ctrl',
        controller : 'PlaylistsCtrl',
        resolve: {
          init: function(playlistSrv, $route) {
            var playlistId = $route.current.params.id;
            playlistSrv.start(playlistId);
          }
        }
      });
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1213:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__snapshot_ctrl__ = __webpack_require__(1214);



/***/ }),

/***/ 1214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export SnapshotsCtrl */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
///<reference path="../../headers/common.d.ts" />


var SnapshotsCtrl = /** @class */ (function () {
    /** @ngInject */
    function SnapshotsCtrl($rootScope, backendSrv) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.backendSrv = backendSrv;
        this.backendSrv.get('/api/dashboard/snapshots').then(function (result) {
            _this.snapshots = result;
        });
    }
    SnapshotsCtrl.prototype.removeSnapshotConfirmed = function (snapshot) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.remove(this.snapshots, { key: snapshot.key });
        this.backendSrv.get('/api/snapshots-delete/' + snapshot.deleteKey)
            .then(function () {
            _this.$rootScope.appEvent('alert-success', ['Snapshot deleted', '']);
        }, function () {
            _this.$rootScope.appEvent('alert-error', ['Unable to delete snapshot', '']);
            _this.snapshots.push(snapshot);
        });
    };
    SnapshotsCtrl.prototype.removeSnapshot = function (snapshot) {
        var _this = this;
        this.$rootScope.appEvent('confirm-modal', {
            title: 'Delete',
            text: 'Are you sure you want to delete snapshot ' + snapshot.name + '?',
            yesText: "Delete",
            icon: "fa-trash",
            onConfirm: function () {
                _this.removeSnapshotConfirmed(snapshot);
            }
        });
    };
    return SnapshotsCtrl;
}());

__WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('grafana.controllers').controller('SnapshotsCtrl', SnapshotsCtrl);


/***/ }),

/***/ 1215:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _) {
  'use strict';

  var module = angular.module('grafana.directives');

  var iconMap = {
    "external link": "fa-external-link",
    "dashboard": "fa-th-large",
    "question": "fa-question",
    "info": "fa-info",
    "bolt": "fa-bolt",
    "doc": "fa-file-text-o",
    "cloud": "fa-cloud",
  };

  module.directive('dashLinksEditor', function() {
    return {
      restrict: 'E',
      controller: 'DashLinkEditorCtrl',
      templateUrl: 'public/app/features/dashlinks/editor.html',
      link: function() {
      }
    };
  });

  module.directive('dashLinksContainer', function() {
    return {
      scope: {
        links: "="
      },
      restrict: 'E',
      controller: 'DashLinksContainerCtrl',
      template: '<dash-link ng-repeat="link in generatedLinks" link="link"></dash-link>',
      link: function() { }
    };
  });

  module.directive('dashLink', function($compile, linkSrv) {
    return {
      restrict: 'E',
      link: function(scope, elem) {
        var link = scope.link;
        var template = '<div class="submenu-item dropdown">' +
          '<a class="pointer dash-nav-link" data-placement="bottom"' +
          (link.asDropdown ? ' ng-click="fillDropdown(link)" data-toggle="dropdown"'  : "") + '>' +
          '<i></i> <span></span></a>';

        if (link.asDropdown) {
          template += '<ul class="dropdown-menu" role="menu">' +
            '<li ng-repeat="dash in link.searchHits"><a href="{{dash.url}}"><i class="fa fa-th-large"></i> {{dash.title}}</a></li>' +
            '</ul>';
        }

        elem.html(template);
        $compile(elem.contents())(scope);

        var anchor = elem.find('a');
        var icon = elem.find('i');
        var span = elem.find('span');

        function update() {
          var linkInfo = linkSrv.getAnchorInfo(link);
          span.text(linkInfo.title);
          anchor.attr("href", linkInfo.href);
        }

        // tooltip
        elem.find('a').tooltip({ title: scope.link.tooltip, html: true, container: 'body' });
        icon.attr('class', 'fa fa-fw ' + scope.link.icon);
        anchor.attr('target', scope.link.target);

        // fix for menus on the far right
        if (link.asDropdown && scope.$last) {
          elem.find('.dropdown-menu').addClass('pull-right');
        }

        update();
        scope.$on('refresh', update);
      }
    };
  });

  module.controller("DashLinksContainerCtrl", function($scope, $rootScope, $q, backendSrv, dashboardSrv, linkSrv) {
    var currentDashId = dashboardSrv.getCurrent().id;

    function buildLinks(linkDef) {
      if (linkDef.type === 'dashboards') {
        if (!linkDef.tags) {
          console.log('Dashboard link missing tag');
          return $q.when([]);
        }

        if (linkDef.asDropdown) {
          return $q.when([{
            title: linkDef.title,
            tags: linkDef.tags,
            keepTime: linkDef.keepTime,
            includeVars: linkDef.includeVars,
            icon: "fa fa-bars",
            asDropdown: true
          }]);
        }

        return $scope.searchDashboards(linkDef, 7);
      }

      if (linkDef.type === 'link') {
        return $q.when([{
          url: linkDef.url,
          title: linkDef.title,
          icon: iconMap[linkDef.icon],
          tooltip: linkDef.tooltip,
          target: linkDef.targetBlank ? "_blank" : "_self",
          keepTime: linkDef.keepTime,
          includeVars: linkDef.includeVars,
        }]);
      }

      return $q.when([]);
    }

    function updateDashLinks() {
      var promises = _.map($scope.links, buildLinks);

      $q.all(promises).then(function(results) {
        $scope.generatedLinks = _.flatten(results);
      });
    }

    $scope.searchDashboards = function(link, limit) {
      return backendSrv.search({tag: link.tags, limit: limit}).then(function(results) {
        return _.reduce(results, function(memo, dash) {
          // do not add current dashboard
          if (dash.id !== currentDashId) {
            memo.push({
              title: dash.title,
              url: 'dashboard/' + dash.uri,
              icon: 'fa fa-th-large',
              keepTime: link.keepTime,
              includeVars: link.includeVars
            });
          }
          return memo;
        }, []);
      });
    };

    $scope.fillDropdown = function(link) {
      $scope.searchDashboards(link, 100).then(function(results) {
        _.each(results, function(hit) {
          hit.url = linkSrv.getLinkUrl(hit);
        });
        link.searchHits = results;
      });
    };

    updateDashLinks();
    $rootScope.onAppEvent('dash-links-updated', updateDashLinks, $scope);
  });

  module.controller('DashLinkEditorCtrl', function($scope, $rootScope) {

    $scope.iconMap = iconMap;
    $scope.dashboard.links = $scope.dashboard.links || [];

    $scope.addLink = function() {
      $scope.dashboard.links.push({ type: 'dashboards', icon: 'external link' });
      $scope.updateSubmenuVisibility();
      $scope.updated();
    };

    $scope.moveLink = function(index, dir) {
      _.move($scope.dashboard.links, index, index+dir);
      $scope.updated();
    };

    $scope.updated = function() {
      $rootScope.appEvent('dash-links-updated');
    };

    $scope.deleteLink = function(index) {
      $scope.dashboard.links.splice(index, 1);
      $scope.updateSubmenuVisibility();
      $scope.updated();
    };

  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1216:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(1217)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1217:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7),
    __webpack_require__(3)
  ], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('DecomposeMetricCtrl', function ($scope, $timeout) {
      $scope.init = function () {
        $scope.initDashboard({
          meta: {canStar: false, canShare: false, canEdit: true, canSave: false},
          dashboard: {
            title: "健康管理",
            id: window.decomposeTarget.metric,
            rows: [{
              title: "test for anmoly",
              panels: getDecomposeMetric(window.decomposeTarget),
            }],
            time: {from: "now-1d", to: "now+5h"}
          }
        }, $scope);

        $timeout(function () {
          $scope.$broadcast('render');
        });
      };

      function getDecomposeMetric(target) {
        var targetMetricName = target.metric;
        var tag = target.tags;
        var rows = [];
        var panelMeta = {
          title: targetMetricName,
          type: 'graph',
          linewidth: 2,
          fill: 0,
          height: "300px",
          lines: true,
          targets: [
            {
              aggregator: "avg",
              metric: targetMetricName,
              downsampleAggregator: "avg",
              downsampleInterval: "15m",
              tags: tag
            },
            {
              aggregator: "avg",
              metric: targetMetricName+".prediction",
              downsampleAggregator: "avg",
              downsampleInterval: "15m",
              tags: tag
            }/*,
            {
              aggregator: "avg",
              metric: targetMetricName+".prediction.min",
              downsampleAggregator: "avg",
              downsampleInterval: "15m",
              tags: tag
            },
            {
              aggregator: "avg",
              metric: targetMetricName+".prediction.max",
              downsampleAggregator: "avg",
              downsampleInterval: "15m",
              tags: tag
            }*/
          ],
          seriesOverrides: [
            {
              alias: targetMetricName + ".prediction{host=" + tag.host + "}",
              color: "#F9D9F9",
              zindex: "-1"
            }/*,
            {
              alias: targetMetricName + ".prediction.min{host=" + tag.host + "}",
              color: "#FDFCFF",
              linewidth:"0",
              fill:"10",
              zindex: "-1"
            },
            {
              alias: targetMetricName + ".prediction.max{host=" + tag.host + "}",
              color: "#008000",
              zindex: "-2",
              fill:"2",
              linewidth: "0",
            }*/
          ],
          legend: {
            alignAsTable: true,
            avg: true,
            min: true,
            max: true,
            current: true,
            total: true,
            show: true,
            values: true
          },
          'x-axis': true,
          'y-axis': true
        };
        rows.push(panelMeta);

        _.each([".trend", ".seasonal", ".noise"], function (defString, index) {
          var panelMeta = {
            title: '',
            type: 'graph',
            fill: 1,
            span: 12,
            linewidth: 2,
            height: "300px",
            lines: true,
            targets: [
              {
                aggregator: "avg",
                metric: "",
                downsampleAggregator: "avg",
                downsampleInterval: "15m",
                tags: {host: ""}
              }
            ],
            seriesOverrides: [],
            legend: {
              alignAsTable: true,
              avg: true,
              min: true,
              max: true,
              current: true,
              total: true,
              show: true,
              values: true
            },
            'x-axis': true,
            'y-axis': true
          };
          panelMeta.id = index + 2;
          panelMeta.title = targetMetricName + defString;
          panelMeta.targets[0].metric = targetMetricName + defString;
          panelMeta.targets[0].tags = tag;
          rows.push(panelMeta);
        });
        return rows;
      }

      $scope.init();
    });
  }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module)))

/***/ }),

/***/ 1218:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular) {
  'use strict';

  angular
    .module('grafana.directives')
    .directive('panelInfoEditor', function() {
      return {
        scope: {
          panel: "="
        },
        restrict: 'E',
        controller: 'PanelInfoEditorCtrl',
        templateUrl: 'app/features/panelinfo/partials/panelInfoEdit.html',
        link: function() {
        }
      };
    }).controller('PanelInfoEditorCtrl', function($scope,timeSrv) {
      $scope.init = function () {
        $scope.panel.helpInfo = $scope.panel.helpInfo || {info: false, title:'',context:''};
      };
      $scope.editInfo = function () {
        $scope.init();
        $scope.panel.helpInfo.info = !$scope.panel.helpInfo.info;
        timeSrv.refreshDashboard();
      };
      $scope.removeInfo = function () {
        $scope.panel.helpInfo = null;
        timeSrv.refreshDashboard();
      };
      $scope.init();
    });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SystemOverviewCtrl", function() { return SystemOverviewCtrl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_core__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_app_core_store__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_app_core_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_app_core_store__);





var HEALTH_TYPE = {
    GREEN: { TEXT: 'green', COLOR: '#66C2A5' },
    YELLOW: { TEXT: 'yellow', COLOR: '#FDAE61' },
    RED: { TEXT: 'red', COLOR: '#D53E4F' },
    GREY: { TEXT: 'grey', COLOR: '#DBE1EA' },
    BLUE: { TEXT: 'blue', COLOR: '#6FCDFB' }
};
var SystemOverviewCtrl = /** @class */ (function () {
    /** @ngInject */
    function SystemOverviewCtrl(backendSrv, alertSrv, contextSrv, alertMgrSrv, healthSrv, serviceDepSrv, hostSrv, utilSrv, $location, $scope, $modal, $q, $translate, NgTableParams) {
        var _this = this;
        this.backendSrv = backendSrv;
        this.alertSrv = alertSrv;
        this.contextSrv = contextSrv;
        this.alertMgrSrv = alertMgrSrv;
        this.healthSrv = healthSrv;
        this.serviceDepSrv = serviceDepSrv;
        this.hostSrv = hostSrv;
        this.utilSrv = utilSrv;
        this.$location = $location;
        this.$scope = $scope;
        this.$modal = $modal;
        this.$q = $q;
        this.$translate = $translate;
        this.NgTableParams = NgTableParams;
        this.healthPanel = {};
        this.alertPanel = {};
        this.exceptionPanel = {};
        this.anomalyPanel = {};
        this.servicePanel = {};
        this.hostPanel = {};
        this.predictionPanel = {};
        this.hostKpi = {};
        this.serviceKpi = {};
        $scope.ctrl = this;
        this.topologyGraphParams = {
            blockSize: 36,
            spacing: 2,
            maxChildCount: 10,
            showTooltip: true,
            showKeys: true,
            thresholds: [HEALTH_TYPE.GREEN.TEXT, HEALTH_TYPE.YELLOW.TEXT, HEALTH_TYPE.RED.TEXT, HEALTH_TYPE.GREY.TEXT],
            colors: [HEALTH_TYPE.GREEN.COLOR, HEALTH_TYPE.YELLOW.COLOR, HEALTH_TYPE.RED.COLOR, HEALTH_TYPE.GREY.COLOR],
            onClick: {
                child: this.hostNodeClickHandler.bind(this)
            }
        };
        this.tableParams = new this.NgTableParams({
            count: 5,
            sorting: { 'anomalyHealth': 'asc' }
        }, {
            counts: []
        });
        this.switchEnabled = __WEBPACK_IMPORTED_MODULE_4_app_core_store___default.a.getBool('grafana.overview.mode');
        this.toolkit = window.jsPlumbToolkit.newInstance();
        $scope.$on("$destroy", function () {
            _this.setOverviewMode();
            _this.toolkit.clear();
        });
        // default data
        this.kpiPanel = {
            leftTableHeads: ['i18n_hostname', 'i18n_hostname'],
            leftTableBodys: [
                { id: '', name: '', data: $translate.i18n.i18n_normal, status: 'green' },
                { id: '', name: '', data: $translate.i18n.i18n_normal, status: 'green' },
                { id: '', name: '', data: $translate.i18n.i18n_normal, status: 'green' }
            ],
            rightPanelHead: { id: '', name: '...' },
            rightItemTypes: {
                ServiceKPI: { id: 'ServiceKPI', name: 'page_overview_kpi_service', data: '...', status: 'green', metrics: {} },
                ServiceState: { id: 'ServiceState', name: 'page_service_process', data: '...', status: 'green', metrics: {} },
                HostNW: { id: 'HostNW', name: 'page_host_network', data: '...', status: 'green', metrics: {} },
                HostCpu: { id: 'HostCpu', name: 'page_overview_cpu_usage', data: '...', status: 'green', metrics: {} },
                HostMem: { id: 'HostMem', name: 'page_overview_mem_usage', data: '...', status: 'green', metrics: {} },
                HostIO: { id: 'HostIO', name: 'page_overview_disk_usage', data: '...', status: 'green', metrics: {} },
            },
            rightMetrics: [],
            leftSelected: '',
            rightSelected: '',
            type: '',
        };
    }
    SystemOverviewCtrl.prototype.setOverviewMode = function () {
        __WEBPACK_IMPORTED_MODULE_4_app_core_store___default.a.set('grafana.overview.mode', this.switchEnabled);
    };
    // copy from anomalyMetic.js
    // 有改动
    SystemOverviewCtrl.prototype.setPanelMetaHost = function (panelDef, metric, hostname) {
        var alias = metric + ".anomaly{host=" + hostname + "}";
        var panel = panelDef;
        panel.title = metric + "{host=" + hostname + "}" + this.$translate.i18n.i18n_anomaly_metric;
        panel.targets[0].metric = metric;
        panel.targets[0].tags.host = hostname;
        panel.targets[1].metric = metric + ".anomaly";
        panel.targets[1].tags.host = hostname;
        panel.targets[2].metric = metric + ".prediction.min";
        panel.targets[2].tags.host = hostname;
        panel.targets[3].metric = metric + ".prediction.max";
        panel.targets[3].tags.host = hostname;
        panel.seriesOverrides[0].alias = alias;
        panel.seriesOverrides[1].alias = metric + ".prediction.min{host=" + hostname + "}";
        panel.seriesOverrides[1].fill = 0;
        panel.seriesOverrides[1].linewidth = 0;
        panel.seriesOverrides[2].alias = metric + ".prediction.max{host=" + hostname + "}";
        panel.seriesOverrides[2].fillBelowTo = metric + ".prediction.min{host=" + hostname + "}";
        panel.seriesOverrides[2].linewidth = 0;
        panel.seriesOverrides[2].fill = 0;
        return panelDef;
    };
    SystemOverviewCtrl.prototype.init = function () {
        var _this = this;
        if (+this.contextSrv.user.systemId === 0 && this.contextSrv.user.orgId) {
            this.$location.url("/systems");
            this.contextSrv.sidmenu = false;
            return;
        }
        this.backendSrv.get('/api/static/template/overview').then(function (response) {
            _this._dashboard = response;
            _this.getAlertStatus();
            _this.getAnomaly();
            _this.getSystemAnomaly();
            _this.getHostSummary();
            _this.getServices();
        }).then(function () {
            _this.$scope.initDashboard({
                meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
                dashboard: _this._dashboard
            }, _this.$scope);
        });
    };
    // 机器资源信息
    SystemOverviewCtrl.prototype.getHostSummary = function () {
        var _this = this;
        this.hostSrv.getHostInfo().then(function (response) {
            _this.hostPanels = response;
        }, function (err) {
            _this.hostPanels = [];
        });
    };
    // 报警情况
    SystemOverviewCtrl.prototype.getAlertStatus = function () {
        var _this = this;
        this.alertPanel.status = [
            { health: HEALTH_TYPE.GREEN.TEXT, text: 'i18n_normal', count: 0 },
            { health: HEALTH_TYPE.YELLOW.TEXT, text: 'i18n_warning', count: 0 },
            { health: HEALTH_TYPE.RED.TEXT, text: 'i18n_critical', count: 0 }
        ];
        this.alertMgrSrv.loadTriggeredAlerts().then(function (response) {
            if (response.data.length) {
                for (var i = 0; i < response.data.length; i++) {
                    response.data[i].status.level === "CRITICAL" ? _this.alertPanel.status[2].count++ : _this.alertPanel.status[1].count++;
                }
            }
            else {
                _this.alertPanel.status[0].text = '';
                _this.alertPanel.status[0].count = _this.$translate.i18n.i18n_normal;
            }
        });
    };
    // 系统异常情况 anomaly
    SystemOverviewCtrl.prototype.getSystemAnomaly = function () {
        var _this = this;
        this.exceptionPanel.status = [
            { health: HEALTH_TYPE.GREEN.TEXT, text: 'CPU: ', count: 0, threadhold: '80%', message: '' },
            { health: HEALTH_TYPE.GREEN.TEXT, text: 'Memory: ', count: 0, threadhold: '80%', message: '' }
        ];
        this.backendSrv.alertD({
            method: "get",
            url: "/summary/topn?" + "threshold=80"
        }).then(function (response) {
            ['cpu', 'mem'].forEach(function (key, i) {
                if (response.data[key].count) {
                    _this.exceptionPanel.status[i].health = HEALTH_TYPE.RED.TEXT;
                    _this.exceptionPanel.status[i].count = response.data[key].count;
                    _this.exceptionPanel.status[i].message = response.data[key].topList;
                }
            });
        });
    };
    // 智能检测异常指标 & 健康指数
    SystemOverviewCtrl.prototype.getAnomaly = function () {
        var _this = this;
        this.anomalyPanel.status = [
            { health: HEALTH_TYPE.RED.TEXT, text: 'i18n_critical', count: -1 },
            { health: HEALTH_TYPE.YELLOW.TEXT, text: 'page_overview_panel_anomaly_metric', count: 0 },
            { health: HEALTH_TYPE.GREEN.TEXT, text: 'page_overview_panel_metric_number', count: 0 }
        ];
        this.healthSrv.load().then(function (data) {
            var healthScore = Math.floor(data.health);
            _this.healthPanel.score = healthScore;
            _this.healthPanel.level = _this.$translate.i18n[__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.getLeveal(healthScore)];
            var colors = healthScore > 75 ? [HEALTH_TYPE.GREEN.COLOR] : (healthScore > 50 ? [HEALTH_TYPE.YELLOW.COLOR] : [HEALTH_TYPE.RED.COLOR]);
            _this.utilSrv.setPie('.health-pie', [
                { label: "", data: healthScore },
                { label: "", data: 100 - healthScore }
            ], colors.concat(['#F3F7FA']));
            if (data.numAnomalyMetrics) {
                _this.anomalyPanel.status[1].count = data.numAnomalyMetrics;
            }
            else {
                _this.anomalyPanel.status[1].health = HEALTH_TYPE.GREEN.TEXT;
                _this.anomalyPanel.status[1].count = 0;
            }
            _this.anomalyPanel.status[2].count = data.numMetrics;
        });
    };
    // 服务状态
    SystemOverviewCtrl.prototype.getServices = function () {
        var _this = this;
        this.hostsResource = {};
        var promiseList = [];
        this.serviceDepSrv.readServiceDependency().then(function (response) {
            if (!__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isEmpty(response.data)) {
                _this.dependencies = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.fromJson(__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.last(response.data).attributes[0].value);
                __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(_this.dependencies.nodes, function (node) {
                    var q = _this.getServiceStatus(node.id, node.name)
                        .then(function (resp) {
                        node.status = resp.data.healthStatusType.toLowerCase();
                        return resp;
                    })
                        .then(function (resp) {
                        _this.hostsResource[node.name] = {};
                        __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.forIn(resp.data.hostStatusMap, function (item, key) {
                            !_this.hostsResource[node.name][key] && (_this.hostsResource[node.name][key] = {
                                "host": item.hostName,
                                "status": item.healthStatusType,
                                "statusText": _this.$translate.i18n[__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.statusFormatter(item.healthStatusType)]
                            });
                        });
                    });
                    promiseList.push(q);
                });
                _this.$q.all(promiseList).finally(function () {
                    _this.toolkit.load({ type: "json", data: __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.cloneDeep(_this.dependencies) }).render(_this.renderFactory());
                });
            }
            else {
                _this.alertSrv.set(_this.$translate.i18n.i18n_sorry, _this.$translate.i18n.page_overview_err_dependency, "error", 2000);
            }
        });
    };
    SystemOverviewCtrl.prototype.getServiceStatus = function (serviceId, serviceName) {
        return this.serviceDepSrv.readServiceStatus(serviceId, serviceName);
    };
    SystemOverviewCtrl.prototype.serviceNodeClickHandler = function (node) {
        var _this = this;
        var serviceId = node.node.data.id;
        var serviceName = node.node.data.name;
        var serviceStatus = node.node.data.status;
        var hosts = [];
        this.topology = this.hostSrv.topology;
        this.servicePanel.currentService = {
            id: serviceId,
            name: serviceName,
            status: serviceStatus,
            icon: node.node.data.icon || ""
        };
        this.kpiPanel.type = 'service';
        this.kpiPanel.leftTableHeads = ['i18n_hostname', 'i18n_status'];
        this.kpiPanel.leftTableBodys = [];
        this.getServiceKpi(serviceId, serviceName).then(function (resp) {
            hosts = Object.keys(resp.hostStatusMap);
            __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(resp.hostStatusMap, function (hostMap, hostKey) {
                _this.kpiPanel.leftTableBodys.push({
                    id: __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.find(_this.hostPanels, { host: hostKey }).id,
                    name: hostKey,
                    data: _this.$translate.i18n[__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.statusFormatter(hostMap.healthStatusType)],
                    status: hostMap.healthStatusType
                });
            });
            _this.leftClickHandler({ name: hosts[0] }, 'service');
            return resp;
        }).then(function (resp) {
            // refresh service-dependency-graph, service status
            __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.find(_this.dependencies.nodes, { name: serviceName }).status = resp.healthStatusType.toLowerCase();
            _this.toolkit.clear();
            _this.toolkit.load({ type: "json", data: __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.cloneDeep(_this.dependencies) });
            __WEBPACK_IMPORTED_MODULE_2_jquery___default()(node.el).addClass("active").siblings().removeClass("active");
        });
    };
    SystemOverviewCtrl.prototype.hostNodeClickHandler = function (node) {
        var _this = this;
        var promiseList = [];
        this.hostPanel.currentHost = {
            id: node._private_.id,
            name: node.name,
            status: node.value
        };
        this.kpiPanel.type = 'host';
        this.kpiPanel.leftTableHeads = ['i18n_servicename', 'i18n_status'];
        this.kpiPanel.leftTableBodys = [];
        this.getServicesOnHost(node._private_.id).then(function (response) {
            // 机器上可能没有服务
            if (__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isEmpty(response.data.services)) {
                _this.leftClickHandler('', 'host');
            }
            __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(response.data.services, function (service) {
                var q = _this.getServiceStatus(service.id, service.name)
                    .then(function (resp) {
                    service.healthStatusType = resp.data.healthStatusType;
                    return resp.data;
                });
                promiseList.push(q);
            });
            _this.$q.all(promiseList).finally(function (resp) {
                __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(response.data.services, function (service) {
                    _this.kpiPanel.leftTableBodys.push({
                        id: service.id,
                        name: service.name,
                        data: _this.$translate.i18n[__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.statusFormatter(service.healthStatusType)],
                        status: service.healthStatusType,
                        icon: (__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.find(_this.dependencies.nodes, { id: "" + service.id, name: service.name }) || {}).icon
                    });
                });
                _this.leftClickHandler(response.data.services[0], 'host');
            });
        });
        this.getHostKpi(node.name);
    };
    SystemOverviewCtrl.prototype.leftClickHandler = function (item, type) {
        var _this = this;
        var promise;
        this.kpiPanel.leftSelected = item.name;
        if (type === 'service') {
            promise = this.getHostKpi(item.name);
            this.hostPanel.currentHost = {
                id: item.id || this.kpiPanel.rightPanelHead.id,
                name: item.name,
                status: item.status
            };
        }
        if (type === 'host') {
            if (__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isEmpty(item)) {
                promise = this.$q.when([]).then(function () {
                    _this.serviceKpi = {};
                });
            }
            else {
                promise = this.getServiceKpi(item.id, item.name);
            }
            this.servicePanel.currentService = {
                id: item.id,
                name: item.name,
                status: item.status,
                icon: item.icon
            };
        }
        promise.then(function () {
            _this.setServiceKpiPanel(_this.kpiPanel.rightPanelHead.name);
            _this.kpiPanel.rightMetrics = [];
            _this.selectKpi('ServiceKPI');
        });
    };
    SystemOverviewCtrl.prototype.getServicesOnHost = function (hostId) {
        return this.backendSrv.alertD({
            url: "/cmdb/host?id=" + hostId
        });
    };
    SystemOverviewCtrl.prototype.getServiceKpi = function (serviceId, serviceName) {
        var _this = this;
        // 拿 servicekpi metric 的 message, 储存在 _.metricHelpMessage 中
        var service = serviceName.split(".")[0];
        this.backendSrv.readMetricHelpMessage(service);
        return this.serviceDepSrv.readMetricStatus(serviceId, serviceName).then(function (response) {
            _this.serviceKpi = response.data;
            return response.data;
        });
    };
    SystemOverviewCtrl.prototype.setServiceKpiPanel = function (hostname) {
        var _this = this;
        // serviceKpi 为空 或者 ServiceKPI 为空
        ['ServiceKPI', 'ServiceState'].forEach(function (itemKey) {
            var itemMap = _this.serviceKpi.hostStatusMap && _this.serviceKpi.hostStatusMap[hostname].itemStatusMap[itemKey];
            __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.extend(_this.kpiPanel.rightItemTypes[itemKey], {
                id: itemKey,
                data: itemMap ? _this.$translate.i18n[__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.statusFormatter(itemMap.healthStatusType)] : _this.$translate.i18n.i18n_empty_tmp,
                status: itemMap ? itemMap.healthStatusType : 'GREY',
                metrics: itemMap ? itemMap.metricStatusMap : null
            });
        });
        // hard code: set servicekpi grey, when service state is grey
        if (this.kpiPanel.rightItemTypes['ServiceState'].status === 'GREY') {
            __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.extend(this.kpiPanel.rightItemTypes['ServiceKPI'], {
                data: this.$translate.i18n[__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.statusFormatter('GREY')],
                status: 'GREY',
                metrics: null
            });
        }
    };
    SystemOverviewCtrl.prototype.getHostKpi = function (hostname) {
        var _this = this;
        // 拿 host kpi metric 的 message, 储存在 _.metricHelpMessage 中
        ['mem', 'io', 'nw', 'cpu'].forEach(function (item) {
            _this.backendSrv.readMetricHelpMessage(item);
        });
        this.kpiPanel.rightPanelHead = {
            id: __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.findWhere(this.hostPanels, { host: hostname }).id,
            name: hostname
        };
        return this.hostSrv.getHostKpi({ hostname: hostname }).then(function (response) {
            _this.hostKpi = response.data;
            __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(response.data.itemStatusMap, function (itemMap, itemKey) {
                var tmp = itemKey.replace('Host', '').replace('Service', '').toLowerCase();
                tmp = (tmp === 'io') ? 'disk' : tmp;
                __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.extend(_this.kpiPanel.rightItemTypes[itemKey], {
                    id: itemKey,
                    // name: itemKey,
                    data: __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.findWhere(_this.hostPanels, { host: hostname })[tmp] || _this.$translate.i18n[__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.statusFormatter(itemMap.healthStatusType)],
                    status: itemMap.healthStatusType,
                    metrics: itemMap.metricStatusMap
                });
            });
            return response.data;
        });
    };
    SystemOverviewCtrl.prototype.selectKpi = function (kpiItem) {
        this.kpiPanel.rightSelected = kpiItem;
        var metricsMap = this.kpiPanel.rightItemTypes[kpiItem].metrics;
        this.kpiPanel.rightMetrics = this.handleKpiMetrics(metricsMap, this.kpiPanel.rightPanelHead.name);
        this.tableParams.settings({
            dataset: this.kpiPanel.rightMetrics
        });
    };
    SystemOverviewCtrl.prototype.handleKpiMetrics = function (metrics, host) {
        var _this = this;
        var metricsTable = [];
        __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(metrics, function (value, key) {
            var health = parseInt(value.health);
            var alertStatus = 'GREEN';
            if (value.alertRuleSet) {
                switch (value.alertLevel) {
                    case 'NORMAL':
                        alertStatus = 'GREEN';
                        break;
                    case 'WARNING':
                        alertStatus = 'YELLOW';
                        break;
                    case 'CRITICAL':
                        alertStatus = 'RED';
                        break;
                }
            }
            else {
                alertStatus = 'GREY';
            }
            metricsTable.push({
                name: key,
                host: host,
                alertRuleSet: value.alertRuleSet ? _this.$translate.i18n.i18n_exist : _this.$translate.i18n.i18n_empty,
                alertLevel: _this.$translate.i18n[__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.translateAlertLevel(value.alertLevel)],
                anomalyHealth: health,
                snoozeState: value.snoozeState,
                triggerRed: health === 0,
                triggerYellow: health > 0 && health < 26 && !value.snoozeState,
                metricHelp: __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.metricHelpMessage[key] ? __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.metricHelpMessage[key].definition : key,
                alertStatus: alertStatus
            });
        });
        return metricsTable;
    };
    // 弹窗 查看历史情况
    SystemOverviewCtrl.prototype.showModal = function (index, metric, host) {
        this.$scope.row = this._dashboard.rows[index];
        this.$scope.panel = this._dashboard.rows[index].panels[0];
        if (index === 7) {
            this.setPanelMetaHost(this.$scope.panel, metric, host);
            this.healthSrv.transformPanelMetricType(this.$scope.panel);
        }
        var healthModal = this.$modal({
            scope: this.$scope,
            templateUrl: 'public/app/features/systemoverview/partials/system_overview_modal.html',
            show: false
        });
        healthModal.$promise.then(healthModal.show);
    };
    SystemOverviewCtrl.prototype.renderFactory = function () {
        var _this = this;
        var canvasElement = document.querySelector(".jtk-canvas");
        return {
            container: canvasElement,
            view: {
                nodes: {
                    "default": {
                        template: "tmplNode",
                        events: {
                            click: this.serviceNodeClickHandler.bind(this)
                        }
                    }
                }
            },
            layout: {
                type: "Absolute"
            },
            lassoFilter: ".controls, .controls *, .miniview, .miniview *",
            dragOptions: {
                filter: ".delete *, .add *"
            },
            events: {
                canvasClick: function (e) {
                    _this.toolkit.clearSelection();
                }
            },
            jsPlumb: {
                Anchor: "Continuous",
                Connector: ["StateMachine", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" }],
                Endpoint: "Blank",
                PaintStyle: { strokeWidth: 1, stroke: HEALTH_TYPE.BLUE.COLOR },
                Overlays: [
                    ["Arrow", { fill: HEALTH_TYPE.BLUE.COLOR, width: 10, length: 10, location: 1 }]
                ]
            },
            consumeRightClick: false,
            enablePanButtons: false,
            enableWheelZoom: false
        };
    };
    SystemOverviewCtrl.prototype.switch = function () {
        this.servicePanel.currentService = {};
        this.hostPanel.currentHost = {};
        this.switchEnabled = !this.switchEnabled;
    };
    return SystemOverviewCtrl;
}());

;
__WEBPACK_IMPORTED_MODULE_3_app_core_core__["b" /* coreModule */].controller('SystemOverviewCtrl', SystemOverviewCtrl);


/***/ }),

/***/ 1220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);



var StyleGuideCtrl = /** @class */ (function () {
    /** @ngInject **/
    function StyleGuideCtrl($http, $routeParams) {
        this.$http = $http;
        this.colors = [];
        this.buttonNames = ['primary', 'secondary', 'inverse', 'success', 'warning', 'danger'];
        this.buttonSizes = ['btn-small', '', 'btn-large'];
        this.buttonVariants = ['-', '-outline-'];
        this.pages = ['colors', 'buttons', 'forms', 'dashboard', 'query-editors', 'cloudwiz'];
        this.theme = __WEBPACK_IMPORTED_MODULE_1_app_core_config___default.a.bootData.user.userTheme;
        this.page = {};
        if ($routeParams.page) {
            this.page[$routeParams.page] = 1;
        }
        else {
            this.page.colors = true;
        }
        if (this.page.colors) {
            this.loadColors();
        }
        this.cloudwiz = {
            thresholdsColor: ['#66C2A5', '#FEE08B', '#FDAE61', '#FE9805', '#D53E4F', '#DBE1EA', '#6FCDFB'],
            thresholdsHoverColor: ['#3DB779', '#FFD500', '#FE9805', '#ff4f45', '#BB1144', '#BABFC7', '#18BEEA']
        };
    }
    StyleGuideCtrl.prototype.loadColors = function () {
        var _this = this;
        this.$http.get('public/sass/styleguide.json').then(function (res) {
            _this.colors = __WEBPACK_IMPORTED_MODULE_2_lodash___default.a.map(res.data[_this.theme], function (value, key) {
                return { name: key, value: value };
            });
        });
    };
    StyleGuideCtrl.prototype.switchTheme = function () {
        var other = this.theme === 'dark' ? 'light' : 'dark';
        window.location.href = window.location.href + '?theme=' + this.theme;
    };
    return StyleGuideCtrl;
}());
__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].controller('StyleGuideCtrl', StyleGuideCtrl);


/***/ }),

/***/ 1221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rootCauseAnalysisCtrl__ = __webpack_require__(1222);



/***/ }),

/***/ 1222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export RootCauseAnalysisCtrl */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_core__ = __webpack_require__(200);



var RootCauseAnalysisCtrl = /** @class */ (function () {
    /** @ngInject */
    function RootCauseAnalysisCtrl(backendSrv, popoverSrv, alertSrv, $location, $scope, $rootScope, $timeout) {
        var _this = this;
        this.backendSrv = backendSrv;
        this.popoverSrv = popoverSrv;
        this.alertSrv = alertSrv;
        this.$location = $location;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.traceList = [];
        this.toolkit = window.jsPlumbToolkit.newInstance();
        this.renderer = this.renderFactory();
        this.loadGraph().then(function (response) {
            if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isEmpty(response.edges)) {
                _this.alertSrv.set("暂无故障溯源关系图，即将前往关联性分析", '', "warning", 2000);
                _this.$timeout(function () {
                    _this.$location.url("/association" + window.location.search);
                }, 2000);
                return;
            }
            _this.graph = response;
            _this.toolkit.load({ type: "json", data: response });
            _this.resetConnection(response);
        });
        this.bindEvent();
        $scope.$on("$destroy", function () {
            _this.toolkit.clear();
        });
        this.$rootScope.onAppEvent('exception-located', this.showGuideResult.bind(this), $scope);
    }
    RootCauseAnalysisCtrl.prototype.loadGraph = function () {
        return this.backendSrv.alertD({
            "url": "/rca/graph"
        }).then(function (response) {
            var data = { "nodes": [], "edges": [], "ports": [], "groups": [] };
            var sigValList = [];
            var idList = [];
            var rate = 1;
            response.data.edges.forEach(function (item) {
                // nodes
                item.src.name = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.getMetricName(item.src.name), item.dest.name = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.getMetricName(item.dest.name);
                item.src.id = item.src.name, item.dest.id = item.dest.name;
                item.src.healthType = item.src.healthType.toLowerCase(), item.dest.healthType = item.dest.healthType.toLowerCase();
                sigValList.push(item.src.sigVal), sigValList.push(item.dest.sigVal);
            });
            rate = 60 / Math.max.apply(Math, sigValList); // node's max-width: 60px
            response.data.edges.forEach(function (item) {
                // nodes
                item.src.sigVal *= rate, item.dest.sigVal *= rate;
                idList.indexOf(item.src.id) === -1 && idList.push(item.src.id) && data.nodes.push(item.src);
                idList.indexOf(item.dest.id) === -1 && idList.push(item.dest.id) && data.nodes.push(item.dest);
                // edges
                // cause --> issue
                data.edges.push({
                    "source": item.dest.id,
                    "target": item.src.id,
                    "data": {
                        "type": null,
                        "score": item.score * 4,
                        "solution": item.solutions
                    },
                });
            });
            return data;
        });
    };
    RootCauseAnalysisCtrl.prototype.renderFactory = function () {
        var _this = this;
        var mainElement = document.querySelector("#jtk-paths"), canvasElement = mainElement.querySelector(".jtk-canvas"), miniviewElement = mainElement.querySelector(".miniview");
        return this.toolkit.render({
            container: canvasElement,
            view: {
                edges: {
                    "default": {
                        paintStyle: { lineWidth: 2, stroke: '#C7C5C1' },
                        overlays: [
                            ["Arrow", { fill: "#C7C5C1", width: 8, length: 8, location: 1 }]
                        ]
                    }
                },
                nodes: {
                    "default": {
                        template: "tmplNode",
                        events: {
                            tap: this.nodeTapHandler.bind(this),
                            click: this.nodeClickHandler.bind(this),
                        }
                    }
                }
            },
            layout: {
                type: "Spring",
                padding: [30, 30]
            },
            miniview: {
                container: miniviewElement
            },
            lassoFilter: ".controls, .controls *, .miniview, .miniview *",
            dragOptions: {
                filter: ".delete *, .add *"
            },
            events: {
                canvasClick: function (e) {
                    _this.toolkit.clearSelection();
                    _this.resetGraph();
                },
                modeChanged: function (mode) {
                    window.jsPlumb.removeClass(window.jsPlumb.getSelector("[mode]"), "selected-mode");
                    window.jsPlumb.addClass(window.jsPlumb.getSelector("[mode='" + mode + "']"), "selected-mode");
                }
            },
            jsPlumb: {
                Anchor: "Continuous",
                Connector: ["StateMachine", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" }],
                Endpoint: "Blank",
                HoverPaintStyle: { stroke: "orange" },
            }
        });
    };
    RootCauseAnalysisCtrl.prototype.resetGraph = function () {
        this.traceList = [];
        window.jsPlumb.removeClass(window.jsPlumb.getSelector(".jtk-node"), "unselected");
        window.jsPlumb.removeClass(window.jsPlumb.getSelector(".jtk-node"), "jtk-animate-source");
        window.jsPlumb.removeClass(window.jsPlumb.getSelector(".jtk-connector"), "unselected");
    };
    RootCauseAnalysisCtrl.prototype.resetConnection = function (response) {
        response.edges.forEach(function (item) {
            window.jsPlumbToolkit.connect({
                source: __WEBPACK_IMPORTED_MODULE_1_jquery___default()("[data-jtk-node-id=\"" + item.source + "\"]").attr('id'),
                target: __WEBPACK_IMPORTED_MODULE_1_jquery___default()("[data-jtk-node-id=\"" + item.target + "\"]").attr('id'),
                paintStyle: { strokeWidth: item.data.score }
            });
        });
    };
    RootCauseAnalysisCtrl.prototype.bindEvent = function () {
        var _this = this;
        window.jsPlumb.on(".controls", "tap", "[mode]", function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var element = args[0].target || args[0].srcElement;
            _this.renderer.setMode(element.getAttribute("mode"));
        });
        window.jsPlumb.on(".controls", "tap", "[reset]", function () {
            _this.toolkit.clearSelection();
            _this.renderer.zoomToFit();
        });
    };
    RootCauseAnalysisCtrl.prototype.nodeClickHandler = function (params) {
        var _this = this;
        this.target = params;
        this.traceList.push(params.el.id); // eg. jsPlumb_2_8
        window.jsPlumb.addClass(this.target.el, "jtk-animate-source");
        this.toolkit.getNode(this.target).node.getTargetEdges().forEach(function (edge) {
            var selectedEdges = _this.renderer.selectEdges({
                element: _this.target.el
            });
            selectedEdges.each(function (conn) {
                window.jsPlumb.removeClass(conn.source, 'unselected');
                _this.traceList.indexOf(conn.targetId) > -1 && window.jsPlumb.removeClass(conn.connector.canvas, 'unselected');
            });
            var selector = "[data-jtk-node-id=\"" + edge.source.id + "\"]";
            __WEBPACK_IMPORTED_MODULE_1_jquery___default()(selector).click();
        });
    };
    RootCauseAnalysisCtrl.prototype.nodeTapHandler = function (params) {
        var _this = this;
        this.resetGraph();
        this.renderer.selectAllEdges({
            element: params.el
        }).addClass('unselected');
        __WEBPACK_IMPORTED_MODULE_1_jquery___default()('.jtk-node').not(params.el).addClass('unselected');
        // search
        var searchParams = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.extend({}, this.$location.search(), {
            metric: params.el.getAttribute("data-jtk-node-id")
        });
        this.$location.search(searchParams);
        // show node details
        this.$scope.detail = {
            name: params.node.data.name,
            type: params.node.data.type,
            description: this.nodeDescriptionHandler(params.node.data.desc)
        };
        // get directly relevant edges
        this.$scope.relevantNodes = [];
        params.node.getTargetEdges().forEach(function (edge) {
            edge.source.data.description = _this.nodeDescriptionHandler(edge.source.data.desc);
            _this.$scope.relevantNodes.push({ data: edge.source.data, edge: edge.data });
        });
        this.$scope.$digest();
    };
    RootCauseAnalysisCtrl.prototype.nodeDescriptionHandler = function (desc) {
        var description = [];
        if (!__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isEmpty(desc)) {
            __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.each(desc, function (item) {
                try {
                    description.push(JSON.parse(item));
                }
                catch (e) {
                    description.push(item);
                }
            });
        }
        else {
            description = [];
        }
        return description;
    };
    RootCauseAnalysisCtrl.prototype.showGuideResult = function (e, params) {
        var _this = this;
        this.$timeout(function () {
            var selectors = __WEBPACK_IMPORTED_MODULE_1_jquery___default()("[data-jtk-node-id=\"" + params.metric + "\"]");
            var node = _this.toolkit.getNode(params.metric);
            if (selectors.length && node) {
                _this.nodeTapHandler({
                    el: selectors[0],
                    node: node
                });
                selectors[0].click();
            }
        }, 100);
    };
    RootCauseAnalysisCtrl.prototype.showNodeDetail = function (node) {
    };
    return RootCauseAnalysisCtrl;
}());

;
__WEBPACK_IMPORTED_MODULE_2_app_core_core__["b" /* coreModule */].controller('RootCauseAnalysisCtrl', RootCauseAnalysisCtrl);


/***/ }),

/***/ 1223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__topnCtrl__ = __webpack_require__(1224);



/***/ }),

/***/ 1224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TopNCtrl */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_core__ = __webpack_require__(200);



var TopNCtrl = /** @class */ (function () {
    /** @ngInject */
    function TopNCtrl(backendSrv, hostSrv, $location, $scope, $rootScope, templateValuesSrv, dynamicDashboardSrv, $popover, $timeout, timeSrv) {
        var _this = this;
        this.backendSrv = backendSrv;
        this.hostSrv = hostSrv;
        this.$location = $location;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.templateValuesSrv = templateValuesSrv;
        this.dynamicDashboardSrv = dynamicDashboardSrv;
        this.$popover = $popover;
        this.$timeout = $timeout;
        this.timeSrv = timeSrv;
        this.targetObj = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.extend({}, {
            metric: "",
            host: "",
            start: "",
            pid: ""
        }, this.$location.search());
        $scope.$on('time-window-selected', this.render.bind(this), $scope);
        $scope.$on('time-window-resize', this.init.bind(this), $scope);
        // manual trigger
        $timeout(function () {
            if (!_this.targetObj.host) {
                __WEBPACK_IMPORTED_MODULE_1_jquery___default()('.guide-close-btn').click();
            }
        }, 100);
    }
    TopNCtrl.prototype.init = function (event, payload) {
        this.range = payload;
        this.getProcess({
            from: payload.from.valueOf(),
            to: payload.to.valueOf()
        });
    };
    TopNCtrl.prototype.render = function (event, payload) {
        // this.selection = payload;
        this.range = payload;
        this.getProcess({
            from: payload.from.valueOf(),
            to: payload.to.valueOf()
        });
    };
    TopNCtrl.prototype.getProcess = function (timeRange) {
        var _this = this;
        this.tableData = [];
        this.selected = -1;
        // To Fix
        if (timeRange.from) {
            this.timePoint = timeRange.from + (timeRange.to - timeRange.from) / 2;
        }
        var host = this.$location.search().host;
        if (!host) {
            return;
        }
        var params = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.extend({
            hostname: host
        }, timeRange);
        this.hostSrv.getProcess(params).then(function (response) {
            _this.tableData = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.orderBy(response.data, ['cpuPercent'], ['desc']);
            _this.pidList = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.map(_this.tableData, 'pid');
        }).then(this.getDashboard.bind(this));
    };
    TopNCtrl.prototype.getDashboard = function () {
        var _this = this;
        if (!this.dashboard) {
            this.backendSrv.get('/api/static/topn').then(function (response) {
                // handle dashboard
                _this.addDashboardTemplating(response);
                // store & init dashboard
                _this.dashboard = response;
                _this.dashboard.time = _this.range;
                _this.$scope.initDashboard({
                    dashboard: _this.dashboard,
                    meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
                }, _this.$scope);
                _this.variableUpdated(_this.targetObj);
            });
        }
        else {
            this.dashboard.time = this.range;
            this.variableUpdated(this.targetObj);
        }
    };
    TopNCtrl.prototype.addDashboardTemplating = function (dashboard) {
        // pid
        this.pidList.forEach(function (pid) {
            dashboard.templating.list[0].options.push({
                "text": pid,
                "value": pid,
                "selected": false
            });
        });
        dashboard.templating.list[0].query = this.pidList.join(',');
        // host
        this.hostList = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.map(this.hostSrv.hostInfo, 'host');
        this.hostList.forEach(function (host) {
            dashboard.templating.list[1].options.push({
                "text": host,
                "value": host,
                "selected": false
            });
        });
        dashboard.templating.list[1].query = this.hostList.join(',');
    };
    TopNCtrl.prototype.variableUpdated = function (obj) {
        var _this = this;
        obj.host && (this.dashboard.templating.list[1].current = { "text": obj.host || "All", "value": obj.host || "$__all", "tags": [] });
        this.templateValuesSrv.init(this.dashboard);
        this.templateValuesSrv.variableUpdated(this.dashboard.templating.list[1]).then(function () {
            _this.dynamicDashboardSrv.update(_this.dashboard);
            _this.$rootScope.$emit('template-variable-value-updated');
            // this.timeSrv.setTime(this.range);
        });
    };
    TopNCtrl.prototype.rowClick = function (pid, index) {
        var _this = this;
        this.currentPid = pid;
        if (this.selected !== index) {
            this.selected = index;
            this.dashboard.templating.list[0].current = { "text": pid.toString(), "value": pid.toString(), "tags": [] };
            this.templateValuesSrv.init(this.dashboard);
            this.templateValuesSrv.variableUpdated(this.dashboard.templating.list[0]).then(function () {
                _this.dynamicDashboardSrv.update(_this.dashboard);
                _this.$rootScope.$emit('template-variable-value-updated');
                // this.timeSrv.setTime(this.range);
            });
        }
        else {
            this.selected = -1;
        }
    };
    return TopNCtrl;
}());

;
__WEBPACK_IMPORTED_MODULE_2_app_core_core__["b" /* coreModule */].controller('TopNCtrl', TopNCtrl);


/***/ })

});
//# sourceMappingURL=0.15fbb71da9a2e708a206.js.map