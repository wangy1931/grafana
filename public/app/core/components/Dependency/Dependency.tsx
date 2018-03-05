import _ from 'lodash';
import React, { Component } from 'react';
import { toJS } from 'mobx';

declare var window: any;
export interface DependencyProps {
  data: any;
}

export default class Dependency extends React.Component<DependencyProps, any> {
  toolkit;
  renderer;
  traceList = [];

  draw(data) {
    data = toJS(data);

    !_.isEmpty(data) && this.toolkit.load({ type: "json", data: toJS(data) });
  }

  componentDidMount() {
    let { data } = this.props;

    this.toolkit = window.jsPlumbToolkit.newInstance();
    this.renderer = this.renderFactory();
    this.draw(data);
    // window.addEventListener('resize', this.resize);
  }

  componentDidUpdate() {
    let { data } = this.props;
    this.draw(data);
  }

  componentWillUnmount() {
    this.toolkit.clear();
    // window.removeEventListener('resize', this.resize);
  }

  renderFactory() {
    var mainElement = document.querySelector("#jtk-paths"),
        canvasElement = mainElement.querySelector(`.jtk-canvas`);

    return this.toolkit.render({
      container: canvasElement,
      view: {
        edges: {
          "default": {
            paintStyle: { lineWidth: 2, stroke: '#C7C5C1' },
            overlays: [
              [ "Arrow", { fill: "#C7C5C1", width: 8, length: 8, location: 1 } ]
            ]
          }
        },
        nodes: {
          "default": {
            template: "tmplNode",
            events: {
              // tap: this.nodeTapHandler.bind(this),
              // click: this.nodeClickHandler.bind(this),
            }
          }
        }
      },
      layout: {
        type: "Spring",
        padding: [ 30, 30 ]
      },
      lassoFilter: ".controls, .controls *, .miniview, .miniview *",
      dragOptions: {
        filter: ".delete *, .add *"
      },
      events: {
        canvasClick: (e) => {
          this.toolkit.clearSelection();
          this.resetGraph();
        },
        modeChanged: (mode) => {
          window.jsPlumb.removeClass(window.jsPlumb.getSelector("[mode]"), "selected-mode");
          window.jsPlumb.addClass(window.jsPlumb.getSelector("[mode='" + mode + "']"), "selected-mode");
        }
      },
      jsPlumb: {
        Anchor: "Continuous",
        Connector: [ "StateMachine", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" } ],
        Endpoint: "Blank",
        HoverPaintStyle: { stroke: "orange" },
      }
    });
  }

  resetGraph() {
    this.traceList = [];
    window.jsPlumb.removeClass(window.jsPlumb.getSelector(".jtk-node"), "unselected");
    window.jsPlumb.removeClass(window.jsPlumb.getSelector(".jtk-node"), "jtk-animate-source");
    window.jsPlumb.removeClass(window.jsPlumb.getSelector(".jtk-connector"), "unselected");
  }

  render() {
    // <div className={styles.noData}>
    //         <Icon type="frown-o" />暂无数据
    //       </div>
    return (
      <div className="rca-service-dependency jtk-container">
          <script type="jtk" id="tmplNode">
              <div>
                  <div className="name">
                      <i className="${icon} service-icon bg-${healthType}"></i>
                      <span className="status-${healthType}">{name}</span>
                  </div>
              </div>
          </script>

          <div className="jtk-main" id="jtk-paths">
              <div className="jtk-demo-canvas jtk-canvas canvas-wide">
              </div>
          </div>
      </div>
    )
  }
}
