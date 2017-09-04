

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import {coreModule, appEvents} from  'app/core/core';
import echarts from 'echarts';

declare var window: any;

export class RootCauseAnalysisCtrl {
  toolkit: any;
  data: any;
  renderer: any;
  source: any;  // path traversal.

  /** @ngInject */
  constructor(private backendSrv, private $location, private $scope, jsPlumbService) {
    // this.toolkit = window.jsPlumbToolkit.newInstance({});
    // this.loadGraph().then(() => {
    //   this.renderer = this.renderFactory();
    // });
    // this.render();
    this.initChart().then(() => {
      console.log(this.data);
      var mainElement = echarts.init(document.getElementById("rcaChart"));

      mainElement.setOption({
        title: {
          text: 'Root Cause Analysis'
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series : [
          {
            type: 'graph',
            layout: 'none',
            data: this.data.nodes.map(node => {
              return {
                x: node.x || Math.random(),
                y: node.y || Math.random(),
                id: node.id,
                name: node.name,
                symbolSize: node.sigVal,
                itemStyle: {
                  normal: {
                    color: node.color || '#33B5E5'
                  }
                },
                draggable: true
              };
            }),
            edges: this.data.edges.map(edge => {
              return {
                source: edge.sourceID,
                target: edge.targetID,
                label: {
                  normal: {
                    width: edge.size,
                    // show: true,
                    // formatter: (({}) => {})
                  }
                },
                symbolSize: [0, 8]
              };
            }),
            edgeSymbol: ['none', 'arrow'],
            label: {
              normal: {
                show: true,
                position: 'bottom'
              }
              // emphasis: {
              //   position: 'right',
              //   show: true
              // }
            },
            roam: true,
            focusNodeAdjacency: true,
            lineStyle: {
              normal: {
                width: 0.5,
                curveness: 0.3,
                opacity: 0.7
              }
            },
            // draggable: true  // layout: 'force'
          }
        ]
        // graphic: echarts.util.map(this.data.nodes, function (dataItem, dataIndex) {
        //   return {
        //     type: 'circle',
        //     shape: {
        //       r: dataItem.sigVal / 2
        //     },
        //     position: mainElement.convertToPixel({seriesIndex: 0}, [2000, 3500]),
        //     invisible: true,
        //     draggable: true,
        //     z: 100,
        //     ondrag: echarts.util.curry(this.onPointDragging, dataIndex)
        //   };
        // })
      }, true);
    });
  }

  onPointDragging() {
    console.log('gggg');
  }

  initChart() {
    this.data = {
      "nodes" : [],
      "edges" : [],
      "ports" : [],
      "groups": []
    }

    // real api
    return this.backendSrv.alertD({
      "url": "/rca/graph"
    }).then(response => {
      var data = response.data.edges;
      var sigValList = [];
      var idList = [];
      var rate = 1;

      data.forEach(item => {
        // nodes
        item.src.name = _.getMetricName(item.src.name), item.dest.name = _.getMetricName(item.dest.name);
        item.src.id = item.src.name, item.dest.id = item.dest.name;
        sigValList.push(item.src.sigVal), sigValList.push(item.dest.sigVal);
      });

      rate = 60 / Math.max(...sigValList);
      data.forEach(item => {
        // nodes
        item.src.sigVal *= rate, item.dest.sigVal *= rate;
        idList.indexOf(item.src.id) === -1 && idList.push(item.src.id) && this.data.nodes.push(item.src);
        idList.indexOf(item.dest.id) === -1 && idList.push(item.dest.id) && this.data.nodes.push(item.dest);
        // edges
        this.data.edges.push({
          "sourceID": item.src.id,
          "targetID": item.dest.id,
          "size"  : item.score * 3
        });
      });
      console.log(idList);
    });
  }

  loadGraph() {
    this.data = {
      "nodes" : [],
      "edges" : [],
      "ports" : [],
      "groups": []
    }

    // real api
    return this.backendSrv.alertD({
      "url": "/rca/graph"
    }).then(response => {
      var data = response.data.edges;
      var sigValList = [];
      var rate = 1;

      data.forEach(item => {
        // nodes
        item.src.name = _.getMetricName(item.src.name), item.dest.name = _.getMetricName(item.dest.name);
        item.src.id = item.src.name, item.dest.id = item.dest.name;
        sigValList.push(item.src.sigVal), sigValList.push(item.dest.sigVal);
      });

      rate = 60 / Math.max(...sigValList);
      data.forEach(item => {
        // nodes
        item.src.sigVal *= rate, item.dest.sigVal *= rate;
        this.data.nodes.push(item.src);
        this.data.nodes.push(item.dest);
        // edges
        this.data.edges.push({
          "source": item.src.id,
          "target": item.dest.id,
          "data"  : { "type": null }
        });
      });
    });
  }

  renderFactory() {
    var mainElement = document.querySelector("#jtk-demo-paths"),
        canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
        miniviewElement = mainElement.querySelector(".miniview");

    // reset canvas height
    $(".jtk-demo-canvas").css({ "height": window.innerHeight - 52 - 28 - 70 });

    return this.toolkit.load({ type: "json", data: this.data }).render({
      container: canvasElement,
      view: {
        edges: {
          "default": {  // #89bcde
            paintStyle: { lineWidth: 1, stroke: '#D8D9DA' },
            overlays: [
              ["Arrow", { fill: "#89bcde", width: 8, length: 8, location: 1 } ]
            ]
          }
        },
        nodes: {
          "default": {
            events: {
              tap: this.nodeTapHandler.bind(this)
            }
          }
        }
      },
      layout: {
        type: "Spring",
        padding: [ 30, 30 ]
      },
      miniview: {
        container: miniviewElement
      },
      lassoFilter: ".controls, .controls *, .miniview, .miniview *",
      dragOptions: {
        filter: ".delete *, .add *"
      },
      events: {
        canvasClick: (e) => {
          this.toolkit.clearSelection();
        },
        modeChanged: function (mode) {
          window.jsPlumb.removeClass(window.jsPlumb.getSelector("[mode]"), "selected-mode");
          window.jsPlumb.addClass(window.jsPlumb.getSelector("[mode='" + mode + "']"), "selected-mode");
        }
      },
      jsPlumb: {
        Anchor: "Continuous",
        Connector: [ "StateMachine", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" } ],
        Endpoint: "Blank",
        HoverPaintStyle: { stroke: "orange" },
      },
      // activeFiltering: true
    });
  }

  render() {
    window.jsPlumb.on(".controls", "tap", "[mode]", (...args) => {
      var element = args[0].target || args[0].srcElement;
      this.renderer.setMode(element.getAttribute("mode"));
    });

    window.jsPlumb.on(".controls", "tap", "[reset]", () => {
      this.toolkit.clearSelection();
      this.renderer.zoomToFit();
    });
  }

  nodeTapHandler(params) {
    // if (this.source == null) {
    //   this.source = params;
    //   window.jsPlumb.addClass(this.source.el, "jtk-animate-source");

    //   // Gets all Edges where this Node is the source.
    //   console.log(this.toolkit.getNode(this.source).node.getSourceEdges());
    //   // find target
    //   this.toolkit.getNode(this.source).node.getSourceEdges().forEach(edge => {
    //     // edge.target.setAttribute("class", "jtk-animate-source");
    //     // console.log(this.toolkit.getNode(edge.target));
    //   });

    //   this.source = null;
    // }
    if (this.source == null) {
      this.source = params;
      window.jsPlumb.addClass(this.source.el, "jtk-animate-source");
    } else {
      // ...or trace a path from the current source to the clicked node.
      var traced = this.renderer.tracePath({
        source: this.source.node,
        target: params.node,
        overlay: ["Diamond", { width: 15, length: 15, fill: "#89bcde" }],
        options: { speed: 250 }
      });
      // cleanup the source for the next one.
      window.jsPlumb.removeClass(this.source.el, "jtk-animate-source");
      this.source = null;

      !traced && alert("No path found!");
    }
  }
};

coreModule.controller('RootCauseAnalysisCtrl', RootCauseAnalysisCtrl);
