import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import {coreModule, appEvents} from  'app/core/core';

declare var window: any;

export class RootCauseAnalysisCtrl {
  toolkit: any;
  renderer: any;
  target: any;  // path traversal.
  mainElement: any;
  graph: any;
  traceList: Array<string> = [];

  /** @ngInject */
  constructor(
    private backendSrv, private popoverSrv, private alertSrv,
    private $location, private $scope, private $rootScope, private $timeout
  ) {
    this.toolkit = window.jsPlumbToolkit.newInstance();
    this.renderer = this.renderFactory();

    this.loadGraph().then(response => {
      if (_.isEmpty(response.edges)) {
        this.alertSrv.set("暂无故障溯源关系图，即将前往关联性分析", '', "warning", 2000);
        this.$timeout(() => {
          this.$location.url(`/association${window.location.search}`);
        }, 2000);
        return;
      }

      this.graph = response;
      this.toolkit.load({ type: "json", data: response });
      this.resetConnection(response);
    });
    this.bindEvent();

    $scope.$on("$destroy", () => {
      this.toolkit.clear();
    });

    this.$rootScope.onAppEvent('exception-located', this.showGuideResult.bind(this), $scope);
  }

  loadGraph() {
    return this.backendSrv.alertD({
      "url": "/rca/graph"
    }).then(response => {
      var data = { "nodes" : [], "edges" : [], "ports" : [], "groups": [] };
      var sigValList = [];
      var idList = [];
      var rate = 1;

      response.data.edges.forEach(item => {
        // nodes
        item.src.name = _.getMetricName(item.src.name), item.dest.name = _.getMetricName(item.dest.name);
        item.src.id = item.src.name, item.dest.id = item.dest.name;
        item.src.healthType = item.src.healthType.toLowerCase(), item.dest.healthType = item.dest.healthType.toLowerCase();
        sigValList.push(item.src.sigVal), sigValList.push(item.dest.sigVal);
      });

      rate = 60 / Math.max(...sigValList);  // node's max-width: 60px
      response.data.edges.forEach(item => {
        // nodes
        item.src.sigVal *= rate, item.dest.sigVal *= rate;
        idList.indexOf(item.src.id) === -1 && idList.push(item.src.id) && data.nodes.push(item.src);
        idList.indexOf(item.dest.id) === -1 && idList.push(item.dest.id) && data.nodes.push(item.dest);
        // edges
        // cause --> issue
        data.edges.push({
          "source": item.dest.id,
          "target": item.src.id,
          "data"  : {
            "type": null,
            "score" : item.score * 4,
            "solution": item.solutions
          },
        });
      });

      return data;
    });
  }

  renderFactory() {
    var mainElement = document.querySelector("#jtk-paths"),
        canvasElement = mainElement.querySelector(`.jtk-canvas`),
        miniviewElement = mainElement.querySelector(".miniview");

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
              tap: this.nodeTapHandler.bind(this),
              click: this.nodeClickHandler.bind(this),
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

  resetConnection(response) {
    response.edges.forEach(item => {
      window.jsPlumbToolkit.connect({
        source: $(`[data-jtk-node-id="${item.source}"]`).attr('id'),
        target: $(`[data-jtk-node-id="${item.target}"]`).attr('id'),
        paintStyle: { strokeWidth: item.data.score }
      });
    });
  }

  bindEvent() {
    window.jsPlumb.on(".controls", "tap", "[mode]", (...args) => {
      var element = args[0].target || args[0].srcElement;
      this.renderer.setMode(element.getAttribute("mode"));
    });

    window.jsPlumb.on(".controls", "tap", "[reset]", () => {
      this.toolkit.clearSelection();
      this.renderer.zoomToFit();
    });
  }

  nodeClickHandler(params) {
    this.target = params;
    this.traceList.push(params.el.id);  // eg. jsPlumb_2_8
    window.jsPlumb.addClass(this.target.el, "jtk-animate-source");

    this.toolkit.getNode(this.target).node.getTargetEdges().forEach(edge => {
      var selectedEdges = this.renderer.selectEdges({
        element: this.target.el
      });
      selectedEdges.each(conn => {
        window.jsPlumb.removeClass(conn.source, 'unselected');
        this.traceList.indexOf(conn.targetId) > -1 && window.jsPlumb.removeClass(conn.connector.canvas, 'unselected');
      });
      var selector = `[data-jtk-node-id="${edge.source.id}"]`;
      $(selector).click();
    });
  }

  nodeTapHandler(params) {
    this.resetGraph();
    this.renderer.selectAllEdges({
      element: params.el
    }).addClass('unselected');
    $('.jtk-node').not(params.el).addClass('unselected');

    // search
    var searchParams = _.extend({}, this.$location.search(), {
      metric: params.el.getAttribute("data-jtk-node-id")
    });
    this.$location.search(searchParams);

    // show node details
    this.$scope.detail = {
      name: params.node.data.name,
      type: params.node.data.type,
      description: this.nodeDescriptionHandler(params.node.data.desc)
    };

    // get directly relevant edges
    this.$scope.relevantNodes = [];
    params.node.getTargetEdges().forEach(edge => {
      edge.source.data.description = this.nodeDescriptionHandler(edge.source.data.desc);
      this.$scope.relevantNodes.push({ data: edge.source.data, edge: edge.data });
    });

    this.$scope.$digest();
  }

  nodeDescriptionHandler(desc) {
    var description = [];

    if (!_.isEmpty(desc)) {
      _.each(desc, (item) => {
        try {
          description.push(JSON.parse(item));
        } catch (e) {
          description.push(item);
        }
      });
    } else {
      description = [];
    }

    return description;
  }

  showGuideResult(e, params) {
    this.$timeout(() => {
      var selectors = $(`[data-jtk-node-id="${params.metric}"]`);
      var node = this.toolkit.getNode(params.metric);

      if (selectors.length && node) {
        this.nodeTapHandler({
          el: selectors[0],
          node: node
        });
        selectors[0].click();
      }
    }, 100);
  }

  showNodeDetail(node) {
  }
};

coreModule.controller('RootCauseAnalysisCtrl', RootCauseAnalysisCtrl);
