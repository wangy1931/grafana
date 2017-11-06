import coreModule from '../core_module';
import kbn from 'app/core/utils/kbn';

// Usage:
// html: <div auto-refresh></div>
// controller: $scope.refresh_interval = '30s', $scope.refresh_func = this.someFunction.bind(this)
export function autoRefresh($timeout, timer) {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, elem, attr) {

      var refresh_timer;
      var interval = scope.refresh_interval;
      if (interval) { setAutoRefresh(interval); }

      function setAutoRefresh (interval) {
        var _i = kbn.interval_to_ms(interval);
        var wait_ms = _i - (Date.now() % _i);
        $timeout(() => {
          start_scheduled_refresh(_i);
          // refreshView();
        }, wait_ms);
      }

      function start_scheduled_refresh (after_ms) {
        cancel_scheduled_refresh();
        refresh_timer = $timeout(() => {
          start_scheduled_refresh(after_ms);
          refreshView();
        }, after_ms);
      }

      function cancel_scheduled_refresh () {
        $timeout.cancel(refresh_timer);
        // timer.cancel(refresh_timer);
      }

      function refreshView () {
        scope.refresh_func();
      }

      scope.$on('$destroy', function() {
        cancel_scheduled_refresh();
      });

    }
  };
}

coreModule.directive('autoRefresh', autoRefresh);

