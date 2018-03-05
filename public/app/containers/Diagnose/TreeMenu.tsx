import _ from 'lodash';
import React from 'react';
import { Tabs, Tree, Slider } from 'antd';
import { inject, observer } from 'mobx-react';
import IContainerProps from 'app/containers/IContainerProps';

const { TabPane } = Tabs;
const TreeNode = Tree.TreeNode;

export interface TreeMenuProps {
  title?: React.ReactNode | string;
  logo?: React.ReactNode | string;
  action?: React.ReactNode | string;
  content?: React.ReactNode;
  extraContent?: React.ReactNode;
  data?: any;
  params?: any;
  breadcrumbList?: Array<{ title: React.ReactNode; href?: string }>;
  tabList?: Array<{ key: string; tab: React.ReactNode; component?: React.ReactNode; default: string }>;
  tabActiveKey?: string;
  onTabChange?: (key: string) => void;
  onTreeCheck?: (key: string) => void;
  location?: React.ReactNode | string;
  className?: string;
}

export default class TreeMenu extends React.Component<TreeMenuProps, any> {
  constructor(props) {
    super(props);
    // this.loadStore();
  }

  onTabChange = (key) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  }

  onSelect = (selectedKeys, info) => {
  }

  onCheck = (checkedKeys, info) => {
    if (this.props.onTreeCheck) {
      this.props.onTreeCheck(checkedKeys);
    }
  }

  renderTree(data) {
    return (
      <Tree
        checkable
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        onSelect={this.onSelect}
        onCheck={this.onCheck}
      >
        {
          data.map(cluster => {
            return (
              <TreeNode title={cluster.name} key={cluster.name}>
                {
                  cluster.child.map(metric => {
                    return (
                      <TreeNode title={metric.name} key={metric.name}>
                        {
                          metric.child.map(host => {
                            return (
                              <TreeNode title={host} key={host} />
                            )
                          })
                        }
                      </TreeNode>
                    )
                  })
                }
              </TreeNode>
            )
          })
        }
        {/* <TreeNode title="parent 1" key="0-0">
          <TreeNode title="parent 1-0" key="0-0-0" disabled>
            <TreeNode title="leaf" key="0-0-0-0" disableCheckbox />
            <TreeNode title="leaf" key="0-0-0-1" />
          </TreeNode>
          <TreeNode title="parent 1-1" key="0-0-1">
            <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
          </TreeNode>
        </TreeNode> */}
      </Tree>
    );
  }

  renderSlider() {
    return (
      <Slider range defaultValue={[20, 50]} />
    );
  }

  render() {
    const {
      data
    } = this.props;

    const tree = this.renderTree(data);
    const slider = this.renderSlider();

    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
          {/* {
            tabList.map(item => <TabPane tab={item.tab} key={item.key} />)
          } */}
          <TabPane tab="Tab 1" key="1">
            {tree}
            {slider}
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            {tree}
            {slider}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
