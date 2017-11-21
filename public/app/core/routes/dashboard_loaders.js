define([
  '../core_module',
],
function (coreModule) {
  "use strict";

  coreModule.default.controller('LoadDashboardCtrl', function($scope, $routeParams, dashboardLoaderSrv, backendSrv, $location) {
    $scope.appEvent("dashboard-fetch-start");

    if (!$routeParams.slug) {
      backendSrv.get('/api/dashboards/home').then(function(homeDash) {
        if (homeDash.redirectUri) {
          $location.path('dashboard/' + homeDash.redirectUri);
        } else {
          var meta = homeDash.meta;
          meta.canSave = meta.canShare = meta.canStar = false;
          $scope.initDashboard(homeDash, $scope);
        }
      });
      return;
    }

    dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug).then(function(result) {
      $scope.initDashboard(result, $scope);
    });

  });

  // coreModule.default.controller('DashFromImportCtrl', function($scope, $location, alertSrv) {
  //   if (!window.grafanaImportDashboard) {
  //     alertSrv.set('抱歉', '不能在没有保存的情况下刷新页面', 'warning', 7000);
  //     $location.path('');
  //     return;
  //   }
  //   $scope.initDashboard({
  //     meta: { canShare: false, canStar: false },
  //     dashboard: window.grafanaImportDashboard
  //   }, $scope);
  // });

  // coreModule.default.controller('NewDashboardCtrl', function($scope, $routeParams) {
  //   var newTitle = $routeParams.title || "新的仪表盘";
  //   var newSystem = $routeParams.system;
  coreModule.default.controller('NewDashboardCtrl', function($scope, $routeParams) {
    var newSystem = $routeParams.system;

    $scope.initDashboard({
      meta: { canStar: false, canShare: false, isNew: true },
      dashboard: {
        title: "New dashboard",  // newTitle
        system: newSystem,
        rows: [
          {
            title: 'Dashboard Row',
            height: '250px',
            panels:[],
            isNew: true,
          }
        ],
        time: {from: "now-6h", to: "now"},
        refresh: "30s",
      },
    }, $scope);
  });

});
