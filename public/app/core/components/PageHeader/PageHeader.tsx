import React, { PureComponent, createElement, Component } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, Tabs } from 'antd';
import classNames from 'classnames';
import './index.less';

const { TabPane } = Tabs;

function getBreadcrumb(breadcrumbNameMap = {}, url) {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach((item) => {
      if (new RegExp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
}

export interface PageHeaderProps {
  title?: React.ReactNode | string;
  logo?: React.ReactNode | string;
  action?: React.ReactNode | string;
  content?: React.ReactNode;
  extraContent?: React.ReactNode;
  routes?: Array<any>;
  params?: any;
  breadcrumbList?: Array<{ title: React.ReactNode; href?: string }>;
  tabList?: Array<{ key: string; tab: React.ReactNode; component?: React.ReactNode; default: string }>;
  tabActiveKey?: string;
  onTabChange?: (key: string) => void;
  tabBarExtraContent?: React.ReactNode;
  linkElement?: React.ReactNode | any;
  style?: React.CSSProperties;
  location?: React.ReactNode | string;
  breadcrumbNameMap?: React.ReactNode | any;
  breadcrumbSeparator?: React.ReactNode | any;
  className?: string;
}

export default class PageHeader extends React.Component<PageHeaderProps, any> {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  onChange = (key) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  };
  getBreadcrumbProps = () => {
    return {
      routes: this.props.routes || this.context.routes,
      params: this.props.params || this.context.params,
      routerLocation: this.props.location || window.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap || this.context.breadcrumbNameMap,
    };
  };
  // Generated according to props
  conversionFromProps = () => {
    const {
      breadcrumbList, breadcrumbSeparator, linkElement = 'a',
    } = this.props;
    return (
      <div className="pageHeader">
        <Breadcrumb
          className="breadcrumb"
          separator={breadcrumbSeparator}
        >
          {breadcrumbList.map(item => (
            <Breadcrumb.Item key={item.title}>
              {item.href ? (createElement(linkElement, {
            [linkElement === 'a' ? 'href' : 'to']: item.href,
          }, item.title)) : item.title}
            </Breadcrumb.Item>
        ))}
        </Breadcrumb>
      </div>
    );
  }
  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const { breadcrumbSeparator, linkElement = 'a' } = this.props;
    // Convert the path to an array
    const pathSnippets = routerLocation.pathname.split('/').filter(i => i);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      const isLinkable = (index !== pathSnippets.length - 1) && currentBreadcrumb.component;
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {createElement(
            isLinkable ? linkElement : 'span',
            { [linkElement === 'a' ? 'href' : 'to']: url },
            currentBreadcrumb.name,
          )}
        </Breadcrumb.Item>
      ) : null;
    });
    // Add home breadcrumbs to your head
    extraBreadcrumbItems.unshift(
      <Breadcrumb.Item key="home">
        {createElement(linkElement, {
        [linkElement === 'a' ? 'href' : 'to']: '/' }, '首页')}
      </Breadcrumb.Item>
    );
    return (
      <Breadcrumb
        className="breadcrumb"
        separator={breadcrumbSeparator}
      >
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  }
  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList, breadcrumbSeparator } = this.props;
    const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps();
    }
    // 如果传入 routes 和 params 属性
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className="breadcrumb"
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      );
    }
    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (location && location.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }
    return null;
  }
  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return (last || !route.component)
      ? <span>{route.breadcrumbName}</span>
      : createElement(linkElement, {
        href: paths.join('/') || '/',
        to: paths.join('/') || '/',
      }, route.breadcrumbName);
  }

  render() {
    const {
      title, logo, action, content, extraContent,
      tabList, className, tabActiveKey, tabBarExtraContent,
    } = this.props;
    const clsString = classNames("pageHeader", className);

    let tabDefaultValue;
    if (tabActiveKey !== undefined && tabList) {
      tabDefaultValue = tabList.filter(item => item.default)[0] || tabList[0];
    }
    const breadcrumb = this.conversionBreadcrumbList();
    const activeKeyProps: any = {
      defaultActiveKey: tabDefaultValue && tabDefaultValue.key,
    };
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }

    return (
      <div className={clsString}>
        {breadcrumb}
        <div className="detail">
          {logo && <div className="logo">{logo}</div>}
          <div className="main">
            <div className="row">
              {title && <h1 className="title">{title}</h1>}
              {action && <div className="action">{action}</div>}
            </div>
            <div className="row">
              {content && <div className="content">{content}</div>}
              {extraContent && <div className="extraContent">{extraContent}</div>}
            </div>
          </div>
        </div>
        {
          tabList &&
          tabList.length && (
            <Tabs
              className="tabs"
              {...activeKeyProps}
              onChange={this.onChange}
              tabBarExtraContent={tabBarExtraContent}
            >
              {
                tabList.map(item => <TabPane tab={item.tab} key={item.key} />)
              }
            </Tabs>
          )
        }
      </div>
    );
  }
}
