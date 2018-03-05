import React from 'react';
import { inject, observer } from 'mobx-react';
import IContainerProps from 'app/containers/IContainerProps';

@inject('view', 'rca2', 'alerting', 'topn', 'graph')
@observer
export class Log extends React.Component<IContainerProps, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div></div>
    )
  }
}
