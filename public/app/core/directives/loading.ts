import angular from 'angular';
import $ from 'jquery';
import coreModule from 'app/core/core_module';

var template = `
<div class="load-wrapper">
  <div class="load">
    <div class="ring">
      <div class="ball-holder">
        <div class="ball"></div>
      </div>
    </div>
  </div>
</div>
`;

function cwLoading($compile, $timeout) {

  return {
    multiElement: true,
    scope: true,
    restrict: 'EA',
    link: function($scope, elem, attrs) {
      var $loading = $(template);
      var duration = parseInt(attrs.duration);

      function show () {
        $loading.appendTo(elem);
        $compile(elem.contents())($scope);
      }

      function hide () {
        $loading.remove();
      }

      $scope.$watch(attrs.show, function(newValue, oldValue) {
        if (angular.isString(newValue)) {
          newValue = !!newValue.match(/true|,?(show),?/i)
        }
        if (newValue === true) {
          show();
          if (!isNaN(duration)) {
            $timeout(hide, duration);
          }
        } else {
          hide();
        }
      });
    }
  };

}

coreModule.directive('cwLoading', cwLoading);
