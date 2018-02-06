
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class OnCallersCtrl {
  user: any;
  users: any;
  oncallerUsers: any;
  pendingInvites: any;
  editor: any;
  orgName: string;

  /** @ngInject */
  constructor(
    private $scope,
    private $location,
    private $q,
    private popoverSrv,
    private $translate,
    private oncallerMgrSrv,
    private backendSrv,
    private alertSrv,
    private contextSrv
  ) {
    this.orgName = contextSrv.user.orgName;
    this.editor = { index: 0 };

    this.$q.all([this.getSystemUser(), this.getOncallerUser()]).finally(() => {
      this.oncallerUsers.forEach(user => {
        var oncallerAdded = _.find(this.users, { email: user.email });
        if (oncallerAdded) {
          oncallerAdded.added = true;
        }
      });
    });
  }

  getSystemUser() {
    return this.backendSrv.get('/api/org/users').then(users => {
      this.users = users;
    });
  }

  getOncallerUser() {
    return this.oncallerMgrSrv.load().then(
      response => {
        this.oncallerUsers = response.data;

        _.each(this.oncallerUsers, user => {
          user.systemName = this.getSystemById(user.service);
        });
      },
      err => {
        this.alertSrv.set('error', err.status + ' ' + (err.data || 'Request failed'), err.severity, 10000);
      }
    );
  }

  getSystemById(id) {
    return this.backendSrv.getSystemById(id);
  }

  addOncaller(user) {
    this.oncallerMgrSrv.currentEditUser = user;
    this.$location.path('oncallers/edit/0');
  }

  remove(user) {
    this.$scope.appEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_delete,
      text: this.$translate.i18n.page_oncaller_delete_duty,
      icon: 'fa-trash',
      noText: this.$translate.i18n.i18n_cancel,
      yesText: this.$translate.i18n.i18n_confirm,
      onConfirm: () => {
        this.oncallerMgrSrv.remove(user.org, user.service, user.id).then(
          () => {
            this.alertSrv.set(this.$translate.i18n.i18n_success, '', 'success', 1000);
            _.find(this.users, { email: user.email }).added = false;
            _.remove(this.oncallerUsers, { id: user.id });
          },
          err => {
            this.alertSrv.set('error', err.status + ' ' + (err.data || 'Request failed'), err.severity, 10000);
          }
        );
      },
    });
  }

  showPopover() {
    this.popoverSrv.show({
      element: document.getElementById('qrcode'),
      position: 'bottom center',
      template: `<div class="toolbar-content">
        <div class="popover-content">
          <img src="public/img/qrcode_cloudwiz.jpg" />
        </div>
      </div>`,
      classes: 'qrcode-popover',
    });
  }
}

coreModule.controller('OnCallersCtrl', OnCallersCtrl);
