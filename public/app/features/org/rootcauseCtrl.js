define([
    'angular',
    'lodash',
    'app/core/utils/datemath'
  ],
  function (angular, _, dateMath) {
    'use strict';

    var module = angular.module('grafana.controllers');
    var newRca = "/rca/feedback/json";

    module.controller('RootCauseCtrl', function ($scope, contextSrv, backendSrv) {
      $scope.createRCA = function () {
        var RcaFeedback = {
          "timestampInSec": dateMath.parse('now', false).valueOf(),
          "alertIds": [$scope.alertId],
          "org": contextSrv.user.orgId,
          "sys": contextSrv.system
        };
        var rootCauseMetrics = [];
        var relatedMetrics = [];
        //Get radio check , but can refactor without jQuery .
        $("#rcaForm input[type='radio']:checked").each(function (index, element) {
          if($(element).attr("value") == "rc") {
            rootCauseMetrics.push({"name": $(element).attr("name")});
          } else if($(element).attr("value") == "sym") {
            relatedMetrics.push({"name": $(element).attr("name")});
          }
        });
        RcaFeedback.rootCauseMetrics = rootCauseMetrics;
        RcaFeedback.relatedMetrics = relatedMetrics;

        return backendSrv.alertD({
          method: "post",
          url: newRca,
          data: angular.toJson(RcaFeedback),
          headers: {'Content-Type': 'text/plain'}
        });
      }
    });
  });
