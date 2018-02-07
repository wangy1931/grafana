import angular from 'angular';
import _ from 'lodash';
import {coreModule, appEvents} from  'app/core/core';

declare var window: any;

export class BuildDependCtrl {
  toolkit: any;
  renderer: any;
  graph: any;
  updateId: any;
  graphId: any;
  draggableTypes: any = [];

  /** @ngInject */
  constructor(private $scope, private $q, private alertSrv, private serviceDepSrv, private $timeout) {
    this.toolkit = window.jsPlumbToolkit.newInstance();
    this.renderer = this.renderFactory();

    $q.all([this.loadGraph(), this.loadInstalledServices()]).finally(() => {
      $timeout(this.bindDraggableEvent.bind(this), 100);
    });

    $scope.$on("$destroy", () => {
      this.toolkit.clear();
    });
  }

  loadInstalledServices() {
    return this.serviceDepSrv.readInstalledService().then(response => {
      var services = response.data;
      // var serviceIconMap = _.serviceIconMap();
      var resourceImgMap = _.resourceImgMap();

      _.each(services, (service) => {
        var icon = resourceImgMap[service.name] || "Azure.svg"
        this.draggableTypes.push({
          id   : service.id,
          key  : service.name,
          label: service.name,
          type : "node",
          icon : `public/img/${icon}`
        });
      });
    });
  }

  bindDraggableEvent() {
    this.renderer.registerDroppableNodes({
      droppables: window.jsPlumb.getSelector(".node-palette li"),
      dragOptions: {
        zIndex: 50000,
        cursor: "move",
        clone: true
      },
      dataGenerator: this.dataGenerator.bind(this)
    });
  }

  loadGraph() {
    return this.serviceDepSrv.readServiceDependency().then(response => {
      var dependencies = {};
      if (!_.isNull(response.data)) {
        dependencies = angular.fromJson(_.last(response.data).attributes[0].value);

        this.updateId = _.last(response.data).id;
        this.graphId  = _.last(response.data).attributes[0].id;
      }

      this.toolkit.load({ data: dependencies });
    });
  }

  bindEvent(canvasElement) {
    window.jsPlumb.on(".controls", "tap", "[mode]", (...args) => {
      var element = args[0].target || args[0].srcElement;
      this.renderer.setMode(element.getAttribute("mode"));
    });

    window.jsPlumb.on(".controls", "tap", "[reset]", () => {
      this.toolkit.clearSelection();
      this.renderer.zoomToFit();
    });

    window.jsPlumb.on(canvasElement, "tap", ".delete", (...args) => {
      var element = args[0].target || args[0].srcElement;
      var info = this.toolkit.getObjectInfo(element);
      this.toolkit.removeNode(info.obj);
    });
  }

  renderFactory() {
    var mainElement = document.querySelector("#jtk-paths"),
        canvasElement = mainElement.querySelector(`.jtk-canvas`),
        miniviewElement = mainElement.querySelector(".miniview");

    this.bindEvent(canvasElement);

    return this.toolkit.render({
      container: canvasElement,
      view : {
        nodes: {
          "default": {
            template: "tmplNode"
          }
        }
      },
      miniview: {
        container: miniviewElement
      },
      layout: {
        type: "Absolute"
      },
      jsPlumb: {
        Anchor: "Continuous",
        Endpoint: "Blank",
        Connector: ["StateMachine", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" }],
        PaintStyle: { strokeWidth: 1, stroke: '#32b2e1' },
        HoverPaintStyle: { stroke: "orange" },
        Overlays: [
          ["Arrow", { fill: "#09098e", width: 10, length: 10, location: 1 }]
        ]
      },
      lassoFilter: ".controls, .controls *, .miniview, .miniview *",
      dragOptions: {
        filter: ".delete *"
      },
      events: {
        canvasClick: () => {
          this.toolkit.clearSelection();
        },
        modeChanged: (mode) => {
          window.jsPlumb.removeClass(window.jsPlumb.getSelector("[mode]"), "selected-mode");
          window.jsPlumb.addClass(window.jsPlumb.getSelector("[mode='" + mode + "']"), "selected-mode");
        }
      },
    });
  }

  save() {
    var graph = angular.toJson(this.toolkit.exportData());
    if (this.updateId && this.graphId) {
      this.serviceDepSrv.updateServiceDependency(graph, this.updateId, this.graphId).then(() => {
        this.alertSrv.set("更新成功", "", "success", 4000);
      });
    } else {
      this.serviceDepSrv.createServiceDependency(graph).then(() => {
        this.alertSrv.set("创建成功", "", "success", 4000);
      });
    }
  }

  dataGenerator(type, dragElement) {
    var $dragElement = angular.element(dragElement);
    // var serviceIconMap = _.serviceIconMap();
    var resourceImgMap = _.resourceImgMap();
    var serviceName = $dragElement.attr('data-node-key');
    var icon = resourceImgMap[serviceName] || "Azure.svg"
    return {
      name: serviceName,
      id  : $dragElement.attr('data-node-id'),
      icon: `public/img/${icon}`
    };
  }

}

coreModule.controller('BuildDependCtrl', BuildDependCtrl);

