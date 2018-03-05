import System from 'systemjs/dist/system.js';

export class BundleLoader {
  lazy: any;
  loadingDefer: any;

  constructor(bundleName) {
    this.lazy = ["$q", "$route", "$rootScope", ($q, $route, $rootScope) => {
      if (this.loadingDefer) {
        return this.loadingDefer.promise;
      }

      this.loadingDefer = $q.defer();

      System.import(bundleName).then(() => {
        this.loadingDefer.resolve();
      });

      return this.loadingDefer.promise;
    }];

  }
}