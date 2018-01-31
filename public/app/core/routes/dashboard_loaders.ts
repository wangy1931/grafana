import coreModule from 'app/core/core_module';
import {impressions} from 'app/features/dashboard/impression_store';
import _ from 'lodash';

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
        }

        // auto link to recent dashboard, otherwise to the first dash.
        var dashIds = _.take(impressions.getDashboardOpened(), 1);
        var promise = this.backendSrv.search({dashboardIds: dashIds, limit: 1}).then(result => {
          return result[0].uri;
        });
        promise.then((uri) => {
          if (uri) {
            $location.path('dashboard/' + uri);
          } else {
            this.backendSrv.search({limit: 1, query: ''}).then(result => {
              if (result[0].uri) {
                $location.path('dashboard/' + result[0].uri)
              } else {
                var meta = homeDash.meta;
                meta.canSave = meta.canShare = meta.canStar = false;
                $scope.initDashboard(homeDash, $scope);
              }
            });
          }
        }, err => {
          var meta = homeDash.meta;
          meta.canSave = meta.canShare = meta.canStar = false;
          $scope.initDashboard(homeDash, $scope);
        });
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
    private alertSrv
  ) {
    if (!window.grafanaImportDashboard) {
      alertSrv.set('抱歉', '不能在没有保存的情况下刷新页面', 'warning', 7000);
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
    var newTitle = $routeParams.title || "新的仪表盘";
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
