import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Cascader } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { contextSrv } from 'app/core/services/context_srv';
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
  collapsed: boolean
  onCollapse?: (collapsed?) => void
}

export default class GlobalHeader extends PureComponent<GlobalHeaderProps, any> {
  componentWillUnmount() {
    // this.triggerResizeEvent.cancel();
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    console.log(collapsed);
    // onCollapse && onCollapse(!collapsed);
    // if (!onCollapse) { contextSrv.toggleSideMenu(null); }
    contextSrv.toggleSideMenu(null);
    this.triggerResizeEvent();
  }

  triggerResizeEvent: any = () => { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  state = {
    options,
  };
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
        <Menu.Item disabled><a href="/profile"><Icon type="user" />个人信息</a></Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Item key="triggerError"><Icon type="close-circle" />触发报错</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );

    return (
      <Header className="global-header">
        <Icon
          className="trigger"
          type={contextSrv.pinned ? 'menu-unfold' : 'menu-fold'}
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
          {contextSrv.user.orgName ? (
            <Dropdown overlay={menu}>
              <span className="action account">
                <Avatar size="small" className="avatar" src={contextSrv.user.gravatarUrl} />
                <span className="name">{contextSrv.user.orgName}</span>
              </span>
            </Dropdown>
          ) : <Spin size="small" style={{ marginLeft: 8 }} />}
        </div>
      </Header>
    );
  }
}
