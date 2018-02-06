
import angular from 'angular';

var directiveModule = angular.module('grafana.directives');

/** @ngInject */
function panelEditorTab(dynamicDirectiveSrv) {
  return dynamicDirectiveSrv.create({
    scope: {
      ctrl: "=",
      editorTab: "=",
      index: "=",
    },
    directive: scope => {
      var pluginId = scope.ctrl.pluginId;
      var tabIndex = scope.index;

      return Promise.resolve({
        name: `panel-editor-tab-${pluginId}${tabIndex}`,
        fn: scope.editorTab.directiveFn,
      });
    }
  });
}

directiveModule.directive('panelEditorTab', panelEditorTab);
