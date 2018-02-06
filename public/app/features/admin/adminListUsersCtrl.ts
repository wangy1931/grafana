
import coreModule from '../../core/core_module';

export class AdminListUsersCtrl {
  /**@ngInject */
  constructor ($scope, backendSrv) {

    $scope.init = function() {
      $scope.getUsers();
    };

    $scope.getUsers = function() {
      backendSrv.get('/api/users').then(function(users) {
        $scope.users = users;
      });
    };

    $scope.deleteUser = function(user) {
      $scope.appEvent('confirm-modal', {
        title: '您想删除' + user.login + ' 用户吗?',
        icon: 'fa-trash',
        yesText: '删除',
        onConfirm: function() {
          backendSrv.delete('/api/admin/users/' + user.id).then(function() {
            $scope.getUsers();
          });
        }
      });
    };

    $scope.init();
  }
}

coreModule.controller('AdminListUsersCtrl', AdminListUsersCtrl);
