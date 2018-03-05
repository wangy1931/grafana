import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Cascader } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { contextSrv } from 'app/core/services/context_srv';
import config from 'app/core/config';
import './index.less';

const { Header } = Layout;

const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  isLeaf: false,
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  isLeaf: false,
}];

export interface GlobalHeaderProps {
  collapsed?: boolean
  onCollapse?: (collapsed?) => void
}

// @observer
export default class GlobalHeader extends PureComponent<GlobalHeaderProps, any> {
  state = {
    options,
    collapsed: contextSrv.collapsed
  };

  componentWillUnmount() {
    // this.triggerResizeEvent.cancel();
  }

  toggle = () => {
    contextSrv.toggleSideMenuState();
    this.setState({ collapsed: contextSrv.collapsed });
    this.triggerResizeEvent();
  }

  triggerResizeEvent: any = () => { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  }
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [{
        label: `${targetOption.label} Dynamic 1`,
        value: 'dynamic1',
      }, {
        label: `${targetOption.label} Dynamic 2`,
        value: 'dynamic2',
      }];
      this.setState({
        options: [...this.state.options],
      });
    }, 1000);
  }

  render() {
    const {
      collapsed,
    } = this.props;

    const menu = (
      <Menu className="menu" selectedKeys={[]}>
        <Menu.Item><a href="/profile"><Icon type="user" />个人信息</a></Menu.Item>
        { config.allowOrgCreate && <Menu.Item ><a href="/org/new"><i className="fa fa-fw fa-plus"></i>新建公司</a></Menu.Item> }
        { contextSrv.hasRole('Admin') && <Menu.Item><a href="/org"><Icon type="user" />公司信息</a></Menu.Item> }
        { contextSrv.hasRole('Admin') && <Menu.Item><a href="/org/users"><Icon type="user" />公司成员</a></Menu.Item> }
        { contextSrv.isGrafanaAdmin &&  <Menu.Item><a href="/org/apikeys"><Icon type="user" />密钥管理</a></Menu.Item> }
        { contextSrv.isGrafanaAdmin &&  <Menu.Item><a href="/datasources"><i className="icon-gf icon-gf-dashboard"></i>数据源</a></Menu.Item> }
        <Menu.Divider />
        <Menu.Item key="logout"><a href="logout"><Icon type="logout" />退出登录</a></Menu.Item>
      </Menu>
    );

    return (
      <Header className="global-header">
        <Icon
          className="trigger"
          type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
          // type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <Cascader
          className="picker"
          defaultValue={['Zhejiang']}
          options={this.state.options}
          loadData={this.loadData}
          onChange={this.onChange}
          changeOnSelect
        />
        <div className="right">
          {contextSrv.user.name ? (
            <Dropdown overlay={menu}>
              <span className="action account">
                <Avatar size="small" className="avatar" src={contextSrv.user.gravatarUrl} />
                <span className="name">{contextSrv.user.name}</span>
              </span>
            </Dropdown>
          ) : <Spin size="small" style={{ marginLeft: 8 }} />}
        </div>
      </Header>
    );
  }
}
