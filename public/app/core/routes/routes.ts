
import './dashboard_loaders';

import angular from 'angular';
import coreModule from 'app/core/core_module';
import {BundleLoader} from './bundle_loader';

/** @ngInject **/
function setupAngularRoutes($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  // var loadPluginsBundle = new BundleLoader('public/app/features/plugins/all');
  // var loadAdminBundle = new BundleLoader('public/app/features/admin/admin');
  // var loadOrgBundle = new BundleLoader('public/app/features/org/all');
  // var loadOncallerBundle = new BundleLoader('public/app/features/oncaller/all');
  // var loadCMDBBundle = new BundleLoader('public/app/features/cmdb/all');
  // var loadSetupBundle = new BundleLoader('public/app/features/setup/all');
  // var loadSummaryBundle = new BundleLoader('public/app/features/summary/all');
  // var loadAnomalyBundle = new BundleLoader('public/app/features/anomaly/all');
  // var loadServiceBundle = new BundleLoader('public/app/features/service/all');
  // var loadAnalysisBundle = new BundleLoader('public/app/features/analysis/all');
  // var loadLogsBundle = new BundleLoader('public/app/features/logs/all');
  // var loadReportBundle = new BundleLoader('public/app/features/report/reportCtrl');
  // var loadRcaBundle = new BundleLoader('public/app/features/rca/all');
  // var loadHostBundle = new BundleLoader('public/app/features/host/all');
  // var loadKnowledgeBundle = new BundleLoader('public/app/features/knowledge/all');

  $routeProvider
  .when('/', {
    templateUrl: 'public/app/features/systemoverview/partials/system_overview.html',
    controller : 'SystemOverviewCtrl',
    controllerAs: 'ctrl',
    reloadOnSearch: false,
  })
  .when('/dashboardlist', {
    templateUrl: 'public/app/partials/dashboard.html',
    controller : 'LoadDashboardCtrl',
    reloadOnSearch: false,
    pageClass: 'page-dashboard',
  })
  .when('/systems', {
    templateUrl: 'public/app/partials/systems.html',
    reloadOnSearch: false,
  })
  .when('/dashboard/:type/:slug', {
    templateUrl: 'public/app/partials/dashboard.html',
    controller : 'LoadDashboardCtrl',
    reloadOnSearch: false,
    pageClass: 'page-dashboard',
  })
  .when('/dashboard-solo/:type/:slug', {
    templateUrl: 'public/app/features/panel/partials/soloPanel.html',
    controller : 'SoloPanelCtrl',
    pageClass: 'page-dashboard',
  })
  .when('/dashboard-import/:file', {
    templateUrl: 'public/app/partials/dashboard.html',
    controller : 'DashFromImportCtrl',
    reloadOnSearch: false,
    pageClass: 'page-dashboard',
  })
  .when('/dashboard/new', {
    templateUrl: 'public/app/partials/dashboard.html',
    controller : 'NewDashboardCtrl',
    reloadOnSearch: false,
    pageClass: 'page-dashboard',
  })
  .when('/import/dashboard', {
    templateUrl: 'public/app/features/dashboard/partials/import.html',
    controller : 'DashboardImportCtrl',
  })
  .when('/datasources', {
    templateUrl: 'public/app/features/plugins/partials/ds_list.html',
    controller : 'DataSourcesCtrl',
    controllerAs: 'ctrl',
  })
  .when('/datasources/edit/:id', {
    templateUrl: 'public/app/features/plugins/partials/ds_edit.html',
    controller : 'DataSourceEditCtrl',
    controllerAs: 'ctrl',
  })
  .when('/datasources/new', {
    templateUrl: 'public/app/features/plugins/partials/ds_edit.html',
    controller : 'DataSourceEditCtrl',
    controllerAs: 'ctrl',
  })
  .when('/alerts', {
    templateUrl: 'public/app/features/org/partials/alerts.html',
    controller : 'AlertsCtrl',
    controllerAs: 'ctrl'
  })
  .when('/alerts/edit/:id', {
    templateUrl: 'public/app/features/org/partials/alertEdit.html',
    controller : 'AlertEditCtrl',
    controllerAs: 'ctrl'
  })
  .when('/alerts/new', {
    templateUrl: 'public/app/features/org/partials/alertEdit.html',
    controller : 'AlertEditCtrl',
    controllerAs: 'ctrl'
  })
  .when('/alerts/status', {
    templateUrl: 'public/app/features/org/partials/alertStatus.html',
    controller : 'AlertStatusCtrl',
    controllerAs: 'ctrl'
  })
  .when('/oncallerschedule', {
    templateUrl: 'public/app/features/oncaller/partials/oncallerSchedule.html',
    controller : 'OnCallerScheduleCtrl'
  })
  .when('/oncallers', {
    templateUrl: 'public/app/features/oncaller/partials/oncallers.html',
    controller : 'OnCallersCtrl',
    controllerAs: 'ctrl'
  })
  .when('/oncallers/edit/:id', {
    templateUrl: 'public/app/features/oncaller/partials/oncallerEdit.html',
    controller : 'OnCallerEditCtrl',
    controllerAs: 'ctrl'
  })
  .when('/oncallers/new', {
    templateUrl: 'public/app/features/oncaller/partials/oncallerEdit.html',
    controller : 'OnCallerEditCtrl',
    controllerAs: 'ctrl'
  })
  .when('/anomaly', {
    templateUrl: 'public/app/features/anomaly/partials/anomaly.html',
    controller : 'AnomalyCtrl'
  })
  .when('/anomaly/history', {
    templateUrl: 'public/app/features/anomaly/partials/anomalyHistory.html',
    controller : 'AnomalyHistory'
  })
  .when('/anomaly/:clusterId', {
    templateUrl: 'public/app/features/anomaly/partials/anomalyMetric.html',
    controller : 'AnomalyMetric',
    reloadOnSearch: true
  })
  .when('/decompose', {
    templateUrl: 'public/app/features/decompose/partials/compose.html',
    controller : 'DecomposeMetricCtrl'
  })
  .when('/org', {
    templateUrl: 'public/app/features/org/partials/orgDetails.html',
    controller : 'OrgDetailsCtrl'
  })
  .when('/org/new', {
    templateUrl: 'public/app/features/org/partials/newOrg.html',
    controller : 'NewOrgCtrl'
  })
  .when('/org/users', {
    templateUrl: 'public/app/features/org/partials/orgUsers.html',
    controller : 'OrgUsersCtrl',
    controllerAs: 'ctrl'
  })
  .when('/org/apikeys', {
    templateUrl: 'public/app/features/org/partials/orgApiKeys.html',
    controller : 'OrgApiKeysCtrl'
  })
  .when('/profile', {
    templateUrl: 'public/app/features/org/partials/profile.html',
    controller : 'ProfileCtrl',
    controllerAs: 'ctrl'
  })
  .when('/profile/password', {
    templateUrl: 'public/app/features/org/partials/change_password.html',
    controller : 'ChangePasswordCtrl'
  })
  .when('/profile/select-org', {
    templateUrl: 'public/app/features/org/partials/select_org.html',
    controller : 'SelectOrgCtrl'
  })
  // ADMIN
  .when('/admin', {
    templateUrl: 'public/app/features/admin/partials/admin_home.html',
    controller : 'AdminHomeCtrl'
  })
  .when('/admin/settings', {
    templateUrl: 'public/app/features/admin/partials/settings.html',
    controller : 'AdminSettingsCtrl'
  })
  .when('/admin/stats', {
    templateUrl: 'public/app/features/admin/partials/stats.html',
    controller : 'AdminStatsCtrl',
    controllerAs: 'ctrl'
  })
  .when('/admin/users', {
    templateUrl: 'public/app/features/admin/partials/users.html',
    controller : 'AdminListUsersCtrl'
  })
  .when('/admin/users/create', {
    templateUrl: 'public/app/features/admin/partials/new_user.html',
    controller : 'AdminEditUserCtrl'
  })
  .when('/admin/users/edit/:id', {
    templateUrl: 'public/app/features/admin/partials/edit_user.html',
    controller : 'AdminEditUserCtrl'
  })
  .when('/admin/orgs', {
    templateUrl: 'public/app/features/admin/partials/orgs.html',
    controller : 'AdminListOrgsCtrl'
  })
  .when('/admin/orgs/edit/:id', {
    templateUrl: 'public/app/features/admin/partials/edit_org.html',
    controller : 'AdminEditOrgCtrl'
  })
  // LOGIN / SIGNUP
  .when('/login', {
    templateUrl: 'public/app/partials/login.html',
    controller : 'LoginCtrl',
  })
  .when('/signupfree', {
    templateUrl: 'public/app/partials/signup.html',
    controller : 'SignupFreeCtrl',
  })
  .when('/invite/:code', {
    templateUrl: 'public/app/partials/signup_invited.html',
    controller : 'InvitedCtrl',
  })
  .when('/signup', {
    templateUrl: 'public/app/partials/signup_step2.html',
    controller : 'SignUpCtrl',
  })
  .when('/user/password/send-reset-email', {
    templateUrl: 'public/app/partials/reset_password.html',
    controller : 'ResetPasswordCtrl',
  })
  .when('/user/password/reset', {
    templateUrl: 'public/app/partials/reset_password.html',
    controller : 'ResetPasswordCtrl',
  })
  .when('/dashboard/snapshots', {
    templateUrl: 'public/app/features/snapshot/partials/snapshots.html',
    controller : 'SnapshotsCtrl',
    controllerAs: 'ctrl',
  })
  .when('/plugins', {
    templateUrl: 'public/app/features/plugins/partials/plugin_list.html',
    controller: 'PluginListCtrl',
    controllerAs: 'ctrl',
  })
  .when('/plugins/:pluginId/edit', {
    templateUrl: 'public/app/features/plugins/partials/plugin_edit.html',
    controller: 'PluginEditCtrl',
    controllerAs: 'ctrl',
  })
  .when('/plugins/:pluginId/page/:slug', {
    templateUrl: 'public/app/features/plugins/partials/plugin_page.html',
    controller: 'AppPageCtrl',
    controllerAs: 'ctrl',
  })
  .when('/global-alerts', {
    templateUrl: 'public/app/features/dashboard/partials/globalAlerts.html',
  })
  .when('/logs', {
    templateUrl: 'public/app/features/logs/partials/logs.html',
    controller : 'LogsCtrl',
    controllerAs: 'ctrl'
  })
  .when('/logs/rules', {
    templateUrl: 'public/app/features/logs/partials/log_rules.html',
    controller : 'LogParseCtrl',
    controllerAs: 'ctrl'
  })
  .when('/logs/rule-detail', {
    templateUrl: 'public/app/features/logs/partials/log_rule_detail.html',
    controller : 'LogParseCtrl',
    controllerAs: 'ctrl'
  })
  .when('/logs/rules/new', {
    templateUrl: 'public/app/features/logs/partials/log_rules_new.html',
    controller : 'LogParseEditCtrl',
    controllerAs: 'ctrl'
  })
  .when('/analysis', {
    templateUrl: 'public/app/features/analysis/partials/analysis.html',
    controller : 'AnalysisCtrl'
  })
  .when('/association', {
    templateUrl: 'public/app/features/org/partials/alertAssociation.html',
    controller : 'AlertAssociationCtrl',
    controllerAs: 'ctrl'
  })
  .when('/knowledgebase', {
    templateUrl: 'public/app/features/knowledge/partials/knowledge_base.html',
    controller : 'CreateKnowledgeCtrl',
  })
  .when('/customer', {
    templateUrl: 'public/app/features/summary/partials/customer.html',
    controller: 'CustomerCtrl'
  })
  .when('/report', {
    templateUrl: 'public/app/features/report/partials/report.html',
    controller: 'ReportCtrl',
    reloadOnSearch: false,
    controllerAs: 'ctrl'
  })
  .when('/report/template', {
    templateUrl: 'public/app/features/report/partials/report_template.html',
    controller: 'ReportCtrl',
    reloadOnSearch: false,
    controllerAs: 'ctrl'
  })
  .when('/report/edit', {
    templateUrl: 'public/app/features/report/partials/report_edit.html',
    controller: 'ReportCtrl',
    reloadOnSearch: false,
    controllerAs: 'ctrl'
  })
  .when('/integrate', {
    templateUrl: 'public/app/features/analysis/partials/logIntegrate.html',
    controller : 'LogIntegrateCtrl'
  })
  .when('/setting/agent', {
    templateUrl: 'public/app/features/setup/partials/host_agent.html',
    controller : 'HostAgentCtrl'
  })
  .when('/setting/service', {
    templateUrl: 'public/app/features/setup/partials/service_agent.html',
    controller : 'ServiceAgentCtrl'
  })
  .when('/setting/log', {
    templateUrl: 'public/app/features/setup/partials/log.html',
    reloadOnSearch: false,
  })
  .when('/setting/proxy', {
    templateUrl: 'public/app/features/setup/partials/proxy.html',
    reloadOnSearch: false,
  })
  .when('/setting/problems', {
    templateUrl: 'public/app/features/setup/partials/problems.html',
    reloadOnSearch: false,
    controllerAs: 'ctrl',
    controller: 'ProblemsCtrl'
  })
  .when('/cmdb/hostlist', {
    templateUrl: 'public/app/features/cmdb/partials/host_list.html',
    controller : 'HostListCtrl'
  })
  .when('/cmdb/hostlist/hostdetail', {
    templateUrl: 'public/app/features/cmdb/partials/host_detail.html',
    controller : 'HostDetailCtrl'
  })
  .when('/cmdb/servicelist', {
    templateUrl: 'public/app/features/cmdb/partials/service_list.html',
    controller : 'ServiceListCtrl'
  })
  .when('/cmdb/servicelist/servicedetail', {
    templateUrl: 'public/app/features/cmdb/partials/service_detail.html',
    controller : 'CMDBServiceDetailCtrl'
  })
  .when('/cmdb/config', {
    templateUrl: 'public/app/features/cmdb/partials/uagent.html',
    controller : 'UagentCtrl',
    controllerAs: 'ctrl'
  })
  .when('/cmdb/config/edit', {
    templateUrl: 'public/app/features/cmdb/partials/uagent_edit.html',
    controller : 'UagentCtrl',
    controllerAs: 'ctrl'
  })
  .when('/cmdb/servicecustom', {
    templateUrl: 'public/app/features/cmdb/partials/service_custom.html',
    controller : 'ServiceCustomCtrl',
    controllerAs: 'ctrl'
  })
  .when('/cmdb/metrics', {
    templateUrl: 'public/app/features/cmdb/partials/metrics_def.html',
    controller : 'MetricsDefCtrl',
    controllerAs: 'ctrl'
  })
  .when('/cmdb/kpi', {
    templateUrl: 'public/app/features/cmdb/partials/metric_kpi.html',
    controller : 'MetricKpiCtrl',
    controllerAs: 'ctrl'
  })
  .when('/service_dependency', {
    templateUrl: 'public/app/features/service/partials/service_dep.html',
    controller : 'BuildDependCtrl',
    controllerAs: 'ctrl'
  })
  // RCA
  .when('/rca', {
    templateUrl: 'public/app/features/rca/partials/rca.html',
    controller : 'RootCauseAnalysisCtrl',
    reloadOnSearch: false
  })
  // Host Topology
  .when('/host_topology', {
    templateUrl: 'public/app/features/host/partials/host.html',
    controller : 'HostTopologyCtrl',
    reloadOnSearch: false
  })
  // Service Topology
  .when('/service_topology', {
    templateUrl: 'public/app/features/service/partials/service.html',
    controller : 'ServiceTopologyCtrl',
    reloadOnSearch: false
  })
  .when('/styleguide/:page?', {
    controller: 'StyleGuideCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'public/app/features/styleguide/styleguide.html',
  })
  .when('/topn', {
    controller: 'TopNCtrl',
    controllerAs: 'ctrl',
    templateUrl: 'public/app/features/topn/partials/topn.html'
  })
  .otherwise({
    templateUrl: 'public/app/partials/error.html',
    controller: 'ErrorCtrl',
    reloadOnSearch: false,
  });
}

coreModule.config(setupAngularRoutes);
