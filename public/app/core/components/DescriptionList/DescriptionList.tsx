import * as React from 'react';
import classNames from 'classnames';
import { Row } from 'antd';
import './index.less';

export default ({ className, title, col = 3, layout = 'horizontal', gutter = 32,
  children, size, ...restProps }) => {
  const clsString = classNames("descriptionList", layout, className, {
    ["small"]: size === 'small',
    ["large"]: size === 'large',
  });
  const column = col > 4 ? 4 : col;
  return (
    <div className={clsString} {...restProps}>
      {title ? <div className="title">{title}</div> : null}
      <Row gutter={gutter}>
        {React.Children.map(children, (child: any) => React.cloneElement(child, { column }))}
      </Row>
    </div>
  );
};

// import React, { Component } from 'react';
// import classNames from 'classnames';
// import { Row } from 'antd';
// import styles from './index.less';

// export interface IProps {
//   className?: string;
//   title?: string;
//   col?: number;
//   layout?: string;
//   gutter?: number;
//   size?: any;
//   Description: any;
// }

// export default class DescriptionList extends Component<IProps, any> {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     const { className, title, col = 3, layout = 'horizontal', gutter = 32,
//       children, size, ...restProps } = this.props;
//     const clsString = classNames(styles.descriptionList, styles[layout], className, {
//       [styles.small]: size === 'small',
//       [styles.large]: size === 'large',
//     });
//     const column = col > 4 ? 4 : col;

//     return (
//       <div className={clsString} {...restProps}>
//         {title ? <div className={styles.title}>{title}</div> : null}
//         <Row gutter={gutter}>
//           {React.Children.map(children, (child: any) => React.cloneElement(child, { column }))}
//         </Row>
//       </div>
//     )
//   }
// }
