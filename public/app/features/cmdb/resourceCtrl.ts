import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class ResourceCtrl {
  searchService: string;
  order: string;
  desc: boolean;
  groups: any;
  list: any;
  detail: any;

  group: any = '';
  groupOptions: any;

  mockData: any = {
    group: [
      { id: 1, name: 'group1', value: 'group1', location: '中国北部' },
      { id: 2, name: 'group2', value: 'group2', location: '中国北部' },
      { id: 3, name: 'group3', value: 'group3', location: '全球' }
    ],
    list: [
      { id: 1, name: 'app1', location: '中国北部', type: '应用程序', group: 'group1' },
      { id: 2, name: 'sql server1', location: '中国北部', type: 'SQL', group: 'group1' },
      { id: 3, name: 'collector', location: '全球', type: '服务总线', group: 'group2' },
      { id: 4, name: 'docker', location: '中国北部', type: 'Blob存储', group: 'group2' },
      { id: 5, name: 'elasticsearch', location: '中国北部', type: 'Redis', group: 'group3' },
      { id: 6, name: 'nginx', location: '中国北部', type: '流量管理器', group: 'group3' }
    ],
    deatil: {}
  };

  /** @ngInject */
  constructor(
    private $scope, private $location, private $timeout,
    private backendSrv, private alertSrv, private contextSrv
  ) {
    this.searchService = '';
    this.order = "'name'";
    this.desc = false;
  }

  // Group
  getGroup() {
    this.groups = this.mockData.group;
    // this.backendSrv.alertD({url: '/cmdb/service'}).then(result => {
    //   this.services = result.data;
    // });
  }
  toList(item) {
    this.$location.url('/cmdb/resource_list?name=' + item.name);
  }

  // List
  getList() {
    this.list = this.mockData.list;
    this.groupOptions = [
      { name: '所有资源组', value: '' }
    ].concat(this.mockData.group);

    if (this.$location.path() === '/cmdb/resource_list' && this.$location.search().name) {
      this.group = this.$location.search().name;
    }
  }
  toDetail(item) {
    this.$location.url('/cmdb/resource_detail?id=' + item.id);
  }
  getListByGroup() {
    console.log(this.group);
  }

  // Detail
  getDetail() {
    this.detail = this.mockData.detail;
  }

  orderBy(order) {
    this.order = "'" + order + "'";
    this.desc = !this.desc;
  }

}

coreModule.controller('ResourceCtrl', ResourceCtrl);
