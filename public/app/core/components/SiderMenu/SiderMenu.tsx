import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

export interface SiderMenuProps {
  menuData?: any
  location?: any
  Authorized?: any
  logo?: any
  collapsed: boolean
  onCollapse: (collapsed?) => void
};

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className="icon" />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export default class SiderMenu extends PureComponent<SiderMenuProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  menus = this.props.menuData;

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      });
    }
  }
  /**
   * Convert pathname to openKeys
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */
  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    // eg. /list/search/articles = > ['','list','search','articles']
    let snippets = pathname.split('/');
    // Delete the end
    // eg.  delete 'articles'
    snippets.pop();
    // Delete the head
    // eg. delete ''
    snippets.shift();
    // eg. After the operation is completed, the array should be ['list','search']
    // eg. Forward the array as ['list','list/search']
    snippets = snippets.map((item, index) => {
      // If the array length > 1
      if (index > 0) {
        // eg. search => ['list','search'].join('/')
        return snippets.slice(0, index + 1).join('/');
      }
      // index 0 to not do anything
      return item;
    });
    snippets = snippets.map((item) => {
      return this.getSelectedMenuKeys(`/${item}`)[0];
    });
    // eg. ['list','list/search']
    return snippets;
  }
  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        this.getFlatMenuKeys(item.children)
      } else {
        keys.push(item.url);
      }
    });
    return keys;
  }
  /**
   * Get selected child nodes
   * /user/chen => /user/:id
   */
  getSelectedMenuKeys = (path) => {
    const flatMenuKeys = this.getFlatMenuKeys(this.menus.menusTop);
    return flatMenuKeys.filter((item) => {
      return new RegExp(`/${item}`).test(path);
    });
  }
  /**
  * 判断是否是http链接.返回 Link 或 a
  * Judge whether it is http link.return a or Link
  * @memberof SiderMenu
  */
  getMenuItemPath = (item) => {
    const itemPath = this.conversionPath(item.url);
    const icon = getIcon(item.icon);
    const { target, text } = item;
    return (
      <a href={itemPath} target={target}>
        {icon}<span>{text}</span>
      </a>
    );
  }
  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item) => {
    if (item.children && item.children.some(child => child.text)) {
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{item.text}</span>
              </span>
            ) : item.text
            }
          key={item.url}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.url}>
          {this.getMenuItemPath(item)}
        </Menu.Item>
      );
    }
  }
  /**
  * 获得菜单子节点
  * @memberof SiderMenu
  */
  getNavMenuItems = (menusData) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.text && !item.hideInMenu)
      .map((item) => {
        const ItemDom = this.getSubMenuOrItem(item);
        return ItemDom;  //this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => !!item);
  }
  getBottomMenuItems = (menusBottomData) => {
    if (!menusBottomData) {
      return [];
    }
    return menusBottomData
      .filter(item => item.text && !item.hideInMenu)
      .map((item) => {
        const ItemDom = this.getSubMenuOrItem(item);
        return ItemDom;  //this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => !!item);
  }
  // conversion Path
  // 转化路径
  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  }
  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
      return check(
        authority,
        ItemDom
      );
    }
    return ItemDom;
  }
  handleOpenChanage = (openKeys, menus) => {
    console.log(openKeys);
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.url === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  }
  handleTopOpenChange = (openKeys) => {
    this.handleOpenChanage(openKeys, this.menus.menusTop);
  }
  handleBottomOpenChange = (openKeys) => {
    this.handleOpenChanage(openKeys, this.menus.menusBottom);
  };
  render() {
    const { logo, collapsed, location: { pathname }, onCollapse } = this.props;
    const { openKeys } = this.state;
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys,
    };
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={168}
        className="sider sider-menu"
      >
        <div className="logo" key="logo">
          <a href="/">
            <img src="public/img/fav32.png" alt="logo" />
            <h1>Cloudwiz</h1>
          </a>
        </div>
        <Menu
          key="MenuTop"
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleTopOpenChange}
          selectedKeys={selectedKeys}
          style={{ padding: '16px 0', width: '100%' }}
        >
          {this.getNavMenuItems(this.menus.menusTop)}
        </Menu>
        <Menu
          key="MenuBottom"
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleBottomOpenChange}
          selectedKeys={selectedKeys}
          style={{ padding: '16px 0', width: '100%', position: 'absolute', bottom: '0' }}
        >
          {this.getBottomMenuItems(this.menus.menusBottom)}
        </Menu>
      </Sider>
    );
  }
}
