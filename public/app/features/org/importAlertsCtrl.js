define([
    'angular',
    'lodash',
  ],
  function (angular, _) {
    'use strict';
    var module = angular.module('grafana.controllers');
    module.controller('ImportAlertsCtrl', function ($q, $scope, alertMgrSrv, alertSrv, contextSrv) {
      $scope.importJson = function () {
        var files = angular.element("#alertUpload")[0].files;
        for (var i = 0, f; f = files[i]; i++) {
          var reader = new FileReader();
          reader.onload = (function () {
            return function (e) {
              try {
                var alertDefs = JSON.parse(e.target.result);
                if (_.isNull(alertDefs[0]) || _.isNull(alertDefs[0].alertDetails))
                  throw "Wrong json";
                var promiseArr = [];
                _.each(alertDefs, function (target, i) {
                  var newAlert = {};
                  var milliseconds = (new Date).getTime();
                  newAlert.org = contextSrv.user.orgId;
                  newAlert.service = contextSrv.system;
                  newAlert.alertDetails = target.alertDetails;
                  newAlert.description = target.description;
                  newAlert.name = target.name;
                  newAlert.creationTime = milliseconds;
                  newAlert.modificationTime = milliseconds;
                  var p = alertMgrSrv.save(newAlert).then(function onSuccess() {
                    return i;
                  }, function onFailed(response) {
                    $scope.appEvent('alert-error', ['ERROR', response.status + " " + (response.data || "Request failed")]);
                    throw "Request failed";
                  });
                  promiseArr.push(p);
                });
                $q.all(promiseArr).then(function (values) {
                  if (values.length == alertDefs.length) {
                    $scope.init();
                    $scope.dismiss();
                    $scope.appEvent('alert-success', ['导入成功', '共导入' + alertDefs.length + '个报警设置']);
                  }
                });
              } catch (err) {
                console.log(err);
                $scope.appEvent('alert-error', ['导入 失败', 'JSON -> JS Serialization failed: ' + err.message]);
                $scope.dismiss();
                return;
              }
            };
          })(f);
          reader.readAsText(f);
        }
      };
    });
  });
