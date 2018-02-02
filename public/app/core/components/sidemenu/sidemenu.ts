///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';

export class SideMenuCtrl {
  isSignedIn: boolean;
  showSignout: boolean;
  user: any;
  mainLinks: any;
  orgMenu: any;
  appSubUrl: string;
  bottomLinks: any;
  submenu: any;
  $rootScope: any;
  configMenu: any;

  /** @ngInject */
  constructor($rootScope, private $scope, private $location, private contextSrv, private backendSrv, private $element, private $translate) {
    this.isSignedIn = contextSrv.isSignedIn;
    this.user = contextSrv.user;
    this.appSubUrl = config.appSubUrl;
    this.showSignout = this.contextSrv.isSignedIn && !config['authProxyEnabled'];
    this.bottomLinks = [];
    this.contextSrv.setPinnedState(true);
    this.contextSrv.sidemenu = true;
    this.$rootScope = $rootScope;
    this.configMenu = config.bootData.mainNavLinks;
    var _self = this;
    this.updateMenu.bind(this)();
    if (this.contextSrv.isSignedIn) {
      this.getMenus.bind(this)();
    }

    this.$scope.$on('$routeChangeSuccess', () => {
      $scope.showSubmenu = false;
    });

    $scope.updateSubmenu = (item) => {
      if (item.url) {
        $scope.showSubmenu = false;
        $location.url(item.url);
        return;
      }
      if (item.click) {
        item.click(item, _self);
      } else {
        $scope.submenu = item;
      }
      $scope.showSubmenu = true;
    };

    $scope.hideSubmenu = () => {
      $scope.showSubmenu = false;
    };

    $scope.updateThdmenu = (item) => {
      $scope.showSubmenu = false;
      if (item.url) {
        if (item.target === '_blank') {
          window.open(item.url);
        } else {
          $location.url(item.url);
        }
        return;
      }
      if (item.click) {
        item.click(_self);
      }
    };
  }

  getMenus() {
    this.backendSrv.get('/api/static/menu').then(response => {
      this.mainLinks = response.menusTop;
    });

    this.bottomLinks.push({
      text: this.user.name,
      icon: "fa fa-fw fa-user",
      children: this.getMsgManagementMenu.bind(this)()
    });

    this.bottomLinks.push({
      text: this.contextSrv.user.orgName,
      icon: "fa fa-fw fa-random",
      class: "scroll-y",
      click: this.getOrgsMenu,
    });

    this.bottomLinks.push({
      text: this.contextSrv.systemsMap[_.findIndex(this.contextSrv.systemsMap,{'Id': this.contextSrv.user.systemId})].SystemsName,
      icon: "fa fa-fw fa-sitemap",
      url: this.getUrl('/systems')
    });
  }

  getUrl(url) {
    return config.appSubUrl + url;
  };

  switchOrg(orgId, _self) {
    this.backendSrv.post('/api/user/using/' + orgId).then(() => {
      _self.contextSrv.sidemenu = false;
      window.location.href = this.getUrl('/systems');
    });
  };

  getMsgManagementMenu() {
    var item = [];

    item.push({
      text: "i18n_menu_profile",
      url : this.getUrl('/profile')
    });

    if (config.allowOrgCreate) {
      item.push({
        text: "i18n_menu_org_new",
        icon: "fa fa-fw fa-plus",
        url: this.getUrl('/org/new')
      });
    }

    if (this.contextSrv.hasRole('Admin')) {
      item.push({
        text: "i18n_menu_org",
        url: this.getUrl("/org"),
      });
      item.push({
        text: "i18n_menu_org_users",
        url: this.getUrl("/org/users"),
      });
      if (this.contextSrv.isGrafanaAdmin) {
        item.push({
          text: "i18n_menu_org_apikeys",
          url: this.getUrl("/org/apikeys"),
        });
      }
    }

    if (this.contextSrv.isGrafanaAdmin) {
      item.push({
        text: "i18n_menu_admin",
        dropdown: 'dropdown',
        children: [
          {
            text: "i18n_menu_admin_setting",
            icon: "fa fa-fw fa-info",
            url: this.getUrl("/admin/settings"),
          },
          {
            text: "i18n_menu_admin_stats",
            icon: "fa fa-fw fa-info",
            url: this.getUrl("/admin/stats"),
          },
          {
            text: "i18n_menu_admin_users",
            icon: "fa fa-fw fa-user",
            url: this.getUrl("/admin/users"),
          },
          {
            text: "i18n_menu_admin_orgs",
            icon: "fa fa-fw fa-users",
            url: this.getUrl("/admin/orgs"),
          }
        ]
      });
      item.push({
        text: "i18n_menu_customer",
        icon: "fa fa-fw fa-users",
        url: this.getUrl("/customer"),
      });
      item.push({
        text: "i18n_menu_datasource",
        icon: "icon-gf icon-gf-dashboard",
        url: this.getUrl("/datasources")
      });
    }

    return item;
  };

  getOrgsMenu(item, _self) {
    _self.backendSrv.get('/api/user/orgs').then(orgs => {
      item.children = [];
      orgs.forEach(org => {
        if (org.orgId === _self.contextSrv.user.orgId) {
          return;
        }

        item.children.push({
          text: org.name,
          icon: "fa fa-fw fa-random",
          click: (_self) => {
            _self.switchOrg(org.orgId, _self);
          }
        });
      });
      _self.$scope.submenu = item;
    });
  };

  newDashboard(_self) {
    _self.$rootScope.appEvent('show-modal', {
      src: 'public/app/partials/select_system.html',
      scope: _self.$scope.$new(),
    });
  };

  updateMenu() {
    var currentPath = this.$location.path();
    if (currentPath.indexOf('/dashboard/snapshot') === 0) {
      return;
    }
    if (!this.contextSrv.isSignedIn) {
      this.$location.url("/login");
      return;
    }
    if (!this.contextSrv.systemsMap.length) {
      this.$location.url("/systems");
      return;
    }
    if (this.contextSrv.user.systemId === 0 && this.contextSrv.user.orgId) {
      this.$location.url("/systems");
      return;
    }
    if (!_.some(this.contextSrv.systemsMap, {'Id': this.contextSrv.user.systemId})) {
      this.contextSrv.user.systemId = this.contextSrv.systemsMap[0].Id;
      this.$location.url("/systems");
      return;
    }
    if (currentPath.indexOf('/admin') === 0) {
      return;
    } else if (currentPath.indexOf('/dashboard/db/') === 0) {
      this.contextSrv.dashboardLink = currentPath;
    } else if (currentPath.indexOf('/login') === 0) {
      return;
    }
  };
}

export function sideMenuDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/sidemenu/sidemenu.html',
    controller: SideMenuCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {},
    link: function(scope, elem) {
      // hack to hide dropdown menu
      elem.on('click.dropdown', '.dropdown-menu a', function(evt) {
        var menu = $(evt.target).parents('.dropdown-menu');
        var parent = menu.parent();
        menu.detach();

        setTimeout(function() {
          parent.append(menu);
        }, 100);
      });

      scope.$on("$destory", function() {
        elem.off('click.dropdown');
      });

      var onresize = function (event) {
        if ($(window).height() > 800) {
          scope.showTooltip = false;
        } else {
          scope.showTooltip = true;
        };
        if (event) {
          scope.$apply();
        }
      };
      onresize(false);
      window.onresize = onresize;
    }
  };
}

coreModule.directive('sidemenu', sideMenuDirective);
