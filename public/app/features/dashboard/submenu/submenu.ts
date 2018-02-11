import _ from 'lodash';
import angular from 'angular';

export class SubmenuCtrl {
  annotations: any;
  variables: any;
  dashboard: any;

  /** @ngInject */
  constructor(private $rootScope, private variableSrv, private $location, private $scope) {
    this.annotations = $rootScope.mainScope.dashboard.templating.list;
    this.variables = $rootScope.mainScope.dashboard.templating.list;
  }

  disableAnnotation(annotation) {
    annotation.enable = !annotation.enable;
    this.$rootScope.$broadcast('refresh');
  }

  // getValuesForTag(variable, tagKey) {
  //   return this.templateValuesSrv.getValuesForTag(variable, tagKey);
  // }

  annotationStateChanged() {
    this.$rootScope.$broadcast('refresh');
  }

  variableUpdated(variable) {
    this.variableSrv.variableUpdated(variable, true);
  }

  openEditView(editview) {
    var search = _.extend(this.$location.search(), { editview: editview });
    this.$location.search(search);
  }
}

export function submenuDirective() {
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

angular.module('grafana.directives').directive('dashboardSubmenu', submenuDirective);
