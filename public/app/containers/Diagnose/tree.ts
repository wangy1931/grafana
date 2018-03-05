import angular from 'angular';
import {NavbarCtrl} from 'app/core/components/navbar/navbar';

export default function createTreeMenu(element, event) {
  var injector = angular.element(document).injector();
  var content = document.createElement('div');
  content.innerHTML = '<cw-tree-menu></cw-tree-menu>';

  injector.invoke(["$compile", "$rootScope", "associationSrv", function($compile, $rootScope, associationSrv) {
    var tmpScope = $rootScope.$new(true);
    tmpScope.event = event;

    $compile(content)(tmpScope);
    tmpScope.$digest();
    tmpScope.$destroy();

    element.html(content);
  }]);
}

export function createNavBar(element, event) {
  var injector = angular.element(document).injector();
  var content = document.createElement('div');
  content.innerHTML = '<navbar icon="fa fa-fw fa-cubes" title=""></navbar>';

  injector.invoke(["$compile", "$rootScope", "$location", "contextSrv", "$translate", function($compile, $rootScope, $location, contextSrv, $translate) {
    var tmpScope = $rootScope.$new(true);
    // tmpScope.ctrl = {
    //   contextSrv: contextSrv
    // };
    console.log(tmpScope);
    tmpScope.ctrl = new NavbarCtrl(tmpScope, $rootScope, $location, contextSrv, $translate);

    $compile(content)(tmpScope);
    // tmpScope.$digest();
    tmpScope.$destroy();

    element.html(content);
  }]);
}
