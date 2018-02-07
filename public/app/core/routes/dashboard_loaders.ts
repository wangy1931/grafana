import coreModule from 'app/core/core_module';

declare var window: any;

export class LoadDashboardCtrl {
  /** @ngInject */
  constructor(
    private $scope, private $routeParams, private $location,
    private dashboardLoaderSrv, private backendSrv
  ) {
    if (!$routeParams.slug) {
      backendSrv.get('/api/dashboards/home').then(homeDash => {
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

    dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug).then(result => {
      $scope.initDashboard(result, $scope);
    });
  }
}
coreModule.controller('LoadDashboardCtrl', LoadDashboardCtrl);

export class DashFromImportCtrl {
  /** @ngInject */
  constructor(
    private $scope, private $location,
    private alertSrv, private $translate
  ) {
    if (!window.grafanaImportDashboard) {
      alertSrv.set($translate.i18n_sorry, $translate.page_dash_err_tip1, 'warning', 7000);
      $location.path('');
      return;
    }
    $scope.initDashboard({
      meta: { canShare: false, canStar: false },
      dashboard: window.grafanaImportDashboard
    }, $scope);
  }
}
coreModule.controller('DashFromImportCtrl', DashFromImportCtrl);

export class NewDashboardCtrl {
  /** @ngInject */
  constructor(
    private $scope, private $routeParams
  ) {
    var newTitle = $routeParams.title || "new dashboard";
    var newSystem = $routeParams.system;

    $scope.initDashboard({
      meta: { canStar: false, canShare: false },
      dashboard: {
        title: newTitle,
        system: newSystem,
        rows: [{ height: '250px', panels: [] }],
        time: {from: "now-6h", to: "now"},
        refresh: "30s",
      },
    }, $scope);
  }
}
coreModule.controller('NewDashboardCtrl', NewDashboardCtrl);
