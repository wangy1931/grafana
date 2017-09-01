

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import {coreModule, appEvents} from  'app/core/core';

declare var window: any;

export class RootCauseAnalysisCtrl {
  toolkit: any;
  data: any;
  renderer: any;
  source: any;  // path traversal.

  /** @ngInject */
  constructor(private backendSrv, private $location, private $scope, jsPlumbService) {
    this.toolkit = window.jsPlumbToolkit.newInstance({
    });  // jsPlumbService.getToolkit("rcaToolkit");
    this.loadGraph();
    this.renderer = this.renderFactory();
    this.render();
  }

  // function
  loadGraph() {
    // mock data
    var rate = 200;
    this.data = {
      "nodes": [
        {
          "id": "1",
          "name": "1",
          "sigVal": 0.15 * rate,
        },
        {
          "id": "2",
          "name": "2",
          "sigVal": 0.15 * rate,
        },
        {
          "id": "3",
          "name": "3",
          "sigVal": 0.15 * rate,
        },
        {
          "id": "4",
          "name": "4",
          "sigVal": 0.2775 * rate,
        },
        {
          "id": "5",
          "name": "5",
          "sigVal": 0.2775 * rate,
        },
        {
          "id": "6",
          "name": "6",
          "sigVal": 0.2775 * rate,
        }
      ],
      "edges": [
        {
          "source": "1",
          "target": "3",
          "data": {
            "type": null
          }
        },
        {
          "source": "1",
          "target": "5",
          "data": {
            "type": null
          }
        },
        {
          "source": "2",
          "target": "3",
          "data": {
            "type": null
          }
        },
        {
          "source": "2",
          "target": "4",
          "data": {
            "type": null
          }
        },
        {
          "source": "2",
          "target": "6",
          "data": {
            "type": null
          }
        },
        {
          "source": "3",
          "target": "4",
          "data": {
            "type": null
          }
        },
        {
          "source": "3",
          "target": "5",
          "data": {
            "type": null
          }
        },
        {
          "source": "3",
          "target": "6",
          "data": {
            "type": null
          }
        },
        {
          "source": "4",
          "target": "1",
          "data": {
            "type": null
          }
        },
        {
          "source": "4",
          "target": "6",
          "data": {
            "type": null
          }
        },
        {
          "source": "5",
          "target": "2",
          "data": {
            "type": null
          }
        },
        {
          "source": "6",
          "target": "5",
          "data": {
            "type": null
          }
        }
      ],
      "ports": [],
      "groups": []
    }

    // real api
    // this.backendSrv.get('/rca/gragh').then(response => {
    //   this.data = response.data.edges;
    //   // data strcture
    //   // [ {
    //   //   "src": {
    //   //     "name" : "0",
    //   //     "sigVal" : 0.15000000000000002
    //   //   },
    //   //   "dest" : {
    //   //     "name" : "1",
    //   //     "sigVal" : 0.2775
    //   //   },
    //   //   "score" : 1.0
    //   // } ]
    //   // api
    //   this.data.forEach(item => {
    //     // nodes
    //     item.src.id = item.src.name;
    //     item.dest.id = item.src.dest;
    //     this.data.nodes.push(item.src);
    //     this.data.nodes.push(item.dest);
    //     // edges
    //     this.data.edges.push({
    //       "source": item.src.id,
    //       "target": item.dest.id,
    //       "data"  : { "type": null }
    //     });
    //   });
    // });
  }

  renderFactory() {
    var mainElement = document.querySelector("#jtk-demo-paths"),
        canvasElement = mainElement.querySelector(".jtk-demo-canvas"),
        miniviewElement = mainElement.querySelector(".miniview");

    // reset canvas height
    $(".jtk-demo-canvas").css({ "height": window.innerHeight - 52 - 28 - 70 });

    return this.toolkit.load({type: "json", data: this.data}).render({
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
        Endpoint: "Blank"
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
