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

