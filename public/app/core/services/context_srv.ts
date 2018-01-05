///<reference path="../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import coreModule from 'app/core/core_module';
import store from 'app/core/store';

export class User {
  isGrafanaAdmin: any;
  isSignedIn: any;
  orgRole: any;
  systemId: any;

  constructor() {
    if (config.bootData.user) {
      _.extend(this, config.bootData.user);
    }
  }
}

export class SignupUser {
  orgName: any;
  name: any;
  constructor() {}
}

export class ContextSrv {
  pinned: any;
  version: any;
  user: User;
  isSignedIn: any;
  isGrafanaAdmin: any;
  isEditor: any;
  sidemenu: any;
  lightTheme: any;
  isOrgAdmin: any;
  dashboardLink: any;
  systemsMap: any;
  hostNum: any;
  isViewer: any;
  signupUser: SignupUser;

  constructor() {
    this.pinned = store.getBool('grafana.sidemenu.pinned', false);
    if (this.pinned) {
      this.sidemenu = true;
    }

    if (!config.buildInfo) {
      config.buildInfo = {};
    }
    if (!config.bootData) {
      config.bootData = {user: {}, settings: {}};
    }

    this.version = config.buildInfo.version;
    this.user = new User();
    this.isSignedIn = this.user.isSignedIn;
    this.isGrafanaAdmin = this.user.isGrafanaAdmin;
    this.isEditor = this.hasRole('Editor') || this.hasRole('Admin');
    this.isOrgAdmin = this.hasRole('Admin');
    this.dashboardLink = "";
    this.systemsMap = config.bootData.systems;
    this.hostNum = 0;
    this.isViewer = this.hasRole('Viewer');
    this.signupUser = new SignupUser();
  }

  hasRole(role) {
    return this.user.orgRole === role;
  }

  setPinnedState(val) {
    this.pinned = val;
    store.set('grafana.sidemenu.pinned', val);
  }

  toggleSideMenu() {
    this.sidemenu = !this.sidemenu;
    this.setPinnedState(true);
  }
}

var contextSrv = new ContextSrv();
export {contextSrv};

coreModule.factory('contextSrv', function() {
  return contextSrv;
});
