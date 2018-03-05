import React from 'react';
import ReactDOM from 'react-dom';
import coreModule from 'app/core/core_module';
import { store } from 'app/stores/store';
import { Provider } from 'mobx-react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { BasicLayout } from 'app/core/components/BasicLayout/BasicLayout';

function WrapInProvider(store, Component, props) {
  return (
    <LocaleProvider locale={zhCN}>
      <Provider {...store}>
        <BasicLayout {...props}>
          <Component {...props} />
        </BasicLayout>
      </Provider>
    </LocaleProvider>
  );
}

/** @ngInject */
export function reactContainer($route, $location, backendSrv, contextSrv) {
  return {
    restrict: 'E',
    template: '',
    link(scope, elem) {
      let component = $route.current.locals.component;
      console.log($route.current.locals);
      let props = {
        location: window.location,
        backendSrv: backendSrv,
        contextSrv: contextSrv
      };

      ReactDOM.render(WrapInProvider(store, component, props), elem[0]);

      scope.$on('$destroy', function() {
        ReactDOM.unmountComponentAtNode(elem[0]);
      });
    },
  };
}

coreModule.directive('reactContainer', reactContainer);
