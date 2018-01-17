define([
  'angular',
  '../core_module',
],
function (angular, coreModule) {
  'use strict';

  coreModule.default.service('utilSrv', function($rootScope, $_modal, $q) {

    this.init = function() {
      $rootScope.onAppEvent('show-modal', this.showModal, $rootScope);
    };

    this.showModal = function(e, options) {
      var modal = $_modal({
        modalClass: options.modalClass,
        template: options.src,
        persist: false,
        show: false,
        scope: options.scope,
        keyboard: false,
        placement: "center"
      });

      $q.when(modal).then(function(modalEl) {
        modalEl.modal('show');
      });
    };

    this.setPie = function (element, pieData, colors, innerRadius) {
      $.plot(element, pieData, {
        series: {
          pie: {
            innerRadius: innerRadius || 0.7,
            show: true,
            stroke: {
              width: 0
            }
          }
        },
        colors: colors
      });
    }

  });

});
