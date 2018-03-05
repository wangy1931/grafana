import React, { Component } from 'react';
import PageHeader from '../PageHeader/PageHeader';
import './PageHeaderLayout.less';

export interface IProps {
  top?: any;
  title: any;
  logo: any;
  action: any;
  content: any;
  extraContent: any;
  tabList: any;
  tabActiveKey?: any;
  routes?: any;
  params?: any;
  breadcrumbNameMap?: any;
  onTabChange?: any;
}

export default class PageHeaderLayout extends Component<IProps, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { top, children, ...restProps } = this.props;

    return (
      <div>
        {top}
        <div className="react-page-container">
          <PageHeader key="pageheader" {...restProps} />
          {children ? <div className="content">{children}</div> : null}
        </div>
      </div>
    )
  }
}

// export default ({ children, top, ...restProps }) => (
//   <div style={{ margin: '-24px -24px 0' }}>
//     {top}
//     <PageHeader key="pageheader" {...restProps} />
//     {children ? <div className={styles.content}>{children}</div> : null}
//   </div>
// );
