import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col } from 'antd';
import './index.less';

const responsive = {
  1: { xs: 24 },
  2: { xs: 24, sm: 12 },
  3: { xs: 24, sm: 12, md: 8 },
  4: { xs: 24, sm: 12, md: 6 },
};

const Description: any = ({ term, column, className, children, ...restProps }) => {
  const clsString = classNames("description", className);
  return (
    <Col className={clsString} {...responsive[column]} {...restProps}>
      {term && <div className="term">{term}</div>}
      {children && <div className="detail">{children}</div>}
    </Col>
  );
};

Description.defaultProps = {
  term: '',
};

Description.propTypes = {
  term: PropTypes.node,
};

export default Description;
