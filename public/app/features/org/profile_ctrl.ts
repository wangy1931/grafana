
import config from 'app/core/config';
import coreModule from 'app/core/core_module';

export class ProfileCtrl {
  user: any;
  old_theme: any;
  orgs: any;
  userForm: any;
  languages: any;
  curLanguage: any;

  /** @ngInject **/
  constructor(private backendSrv, private contextSrv, private $location, private $translate) {
    this.languages = [
      { text: '中文简体', value: 'zh_CN' },
      { text: 'English', value: 'en' }
    ];
    this.getUser();
    this.getUserOrgs();
  }

  getUser() {
    this.backendSrv.get('/api/user').then(user => {
      this.user = user;
      this.user.theme = user.theme || 'dark';
    });
  }

  getUserOrgs() {
    this.backendSrv.get('/api/user/orgs').then(orgs => {
      this.orgs = orgs;
    });
  }

  setUsingOrg(org) {
    this.backendSrv.post('/api/user/using/' + org.orgId).then(() => {
      window.location.href = config.appSubUrl + '/profile';
    });
  }

  update() {
    if (!this.userForm.$valid) { return; }

    this.backendSrv.put('/api/user/', this.user).then(() => {
      this.contextSrv.user.name = this.user.name || this.user.login;
      if (this.old_theme !== this.user.theme) {
        window.location.href = config.appSubUrl + this.$location.path();
      }
    });
  }

  updateLanguage(lang) {
    this.$translate.use(lang).then(() => {
      window.location.href = config.appSubUrl + this.$location.path();
    });
  }

}

coreModule.controller('ProfileCtrl', ProfileCtrl);
