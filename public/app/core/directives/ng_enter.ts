import coreModule from '../core_module';

coreModule.directive('ngEnter', function() {
  return function(scope, elem, attrs) {
    elem.bind('keydown keypress', function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});
