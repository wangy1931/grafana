
import angular from 'angular';
import coreModule from 'app/core/core_module';

export class StaticSrv {
  /** @ngInject */
  constructor(private backendSrv) {}

  getExpertReports() {
    return this.getTemplate('report', 'report').then((res) => {
      return {reports: res.reports, url: this.backendSrv.downloadUrl+'/report'}
    });
  }

  getDashboard(name) {
    return this.getTemplate('dashboard', name);
  }

  getAlertD(name) {
    return this.getTemplate('alertd', name);
  }

  getMetrics(name) {
    return this.getTemplate('metrics', name);
  }

  getConfig() {
    return this.getTemplate('config', 'config');
  }

  getMenu() {
    return this.getTemplate('menu', 'menu');
  }

  getKPI() {
    return this.getTemplate('kpi', 'kpi');
  }

  getInstallation(name) {
    return this.getTemplate('installation', name);
  }

  getTemplate(type, name) {
    return this.backendSrv.get(`/api/static/${type}/${name}`).then(res => res.JsonData);
  }

  getStatics(type) {
    return this.backendSrv.get(`/api/admin/statics/${type}`)
  }

  getStaticById(id) {
    return this.backendSrv.get(`/api/admin/static/${id}`)
  }

  updateStatic(data) {
    return this.backendSrv.post('/api/admin/static', data)
  }

  deleteStatic(id) {
    return this.backendSrv.delete(`/api/admin/static/${id}`)
  }

}

coreModule.service('staticSrv', StaticSrv);
