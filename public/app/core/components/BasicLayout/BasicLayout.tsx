import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message } from 'antd';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import GlobalHeader from 'app/core/components/GlobalHeader/GlobalHeader';
import SiderMenu from 'app/core/components/SiderMenu/SiderMenu';
import { contextSrv } from 'app/core/services/context_srv';

const { Content } = Layout;

export interface BasicLayoutProps {
  location?: any
  context?: any
}

@inject('context')
@observer
export class BasicLayout extends React.Component<BasicLayoutProps, any> {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }

  getChildContext() {
    const { location } = this.props;
    return {
      location,
    };
  }

  componentDidMount() {
  }

  handleMenuCollapse = (collapsed) => {
    // const { context } = this.props;
    // context.toggleSideMenu(collapsed);
    contextSrv.toggleSideMenuState();
  }

  render() {
    const {
      location = window.location, children, context
    } = this.props;

    // const MainView = React.createElement('<div className="main-view" ng-view></div>')

    return (
      <Layout>
        {/* <SiderMenu
          menuData={menuData}
          collapsed={contextSrv.pinned}
          location={location}
          onCollapse={this.handleMenuCollapse}
        /> */}
        {/* <Layout> */}
          <GlobalHeader
          // collapsed={context.collapsed}
          collapsed={contextSrv.collapsed}
          onCollapse={this.handleMenuCollapse}
          />
          <Content style={{ height: '100%' }}>
            {children ? children : null}
          </Content>
        {/* </Layout> */}
      </Layout>
    );
  }
}
