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

  /** @ngInject */
  constructor(
    private $scope, private $location, private resourceSrv,
    private backendSrv, private alertSrv, private contextSrv
  ) {
    this.searchService = '';
    this.order = "'name'";
    this.desc = false;
  }

  // Group
  getGroup() {
    this.resourceSrv.getGroup().then(result => {
      this.groups = result;
    });
  }
  toList(item) {
    this.$location.url(`/cmdb/resource_list?name=${item.name}&id=${item.id}`);
  }

  // List
  getList() {
    var searchParams = this.$location.search();
    this.groupOptions = [
      { name: '所有资源组', value: '' }
    ].concat(this.resourceSrv.groups);

    if (this.$location.path() === '/cmdb/resource_list' && searchParams.name) {
      this.group = searchParams.name;
    }

    this.resourceSrv.getList().then(result => {
      this.list = result;
    });
  }
  toDetail(item) {
    this.$location.url(`/cmdb/resource_detail?id=${item.id}`);
  }
  getListByGroup() {
    this.$location.search({
      id: (_.find(this.resourceSrv.groups, { name: this.group }) || {}).id || '',
      name: this.group
    });
  }

  // Detail
  getDetail() {
    var searchParams = this.$location.search();
    this.resourceSrv.getDetail(searchParams).then(result => {
      this.detail = result;
    });
  }

  orderBy(order) {
    this.order = "'" + order + "'";
    this.desc = !this.desc;
  }

}

coreModule.controller('ResourceCtrl', ResourceCtrl);
