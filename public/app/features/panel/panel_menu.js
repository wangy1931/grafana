define([
  'angular',
  'jquery',
  'lodash',
  'tether',
],
function (angular, $, _, Tether) {
  'use strict';

  angular
    .module('grafana.directives')
    .directive('panelMenu', function($compile) {
      var linkTemplate =
          '<span class="panel-title drag-handle pointer">' +
            '<span class="icon-gf panel-alert-icon"></span>' +
            '<span class="panel-title-text drag-handle">{{ctrl.panel.title | interpolateTemplateVars:this}}</span>' +
            '<span class="panel-time-info" ng-show="ctrl.timeInfo"><i class="fa fa-clock-o"></i> {{ctrl.timeInfo}}</span>' +
          '</span>';

      function createMenuTemplate(ctrl) {
        // debugger
        var template = '<div class="panel-right-menu drag-handle" ng-show="!ctrl.loading" ng-class="{panelError: ctrl.error}">';
        _.each(ctrl.getMenu(), function (item) {
          if (item.role === 'Editor' && !ctrl.dashboard.meta.canEdit) {
            return;
          }
          template += '<span class="';
          var className = 'panel-right-menu-item';
          if (item.hover) {
            className += ' ' + item.hover;
          }
          template += className + '"';
          template += ' ng-click="' + item.click + '" bs-tooltip="' + "'" + item.text + "'" + '" data-container="body">';
          template += '<i class="fa ' + item.icon + '"></i>';
          template += '</span>';
        });

        template += '<div class="dropdown pull-right panel-right-menu-item">';
        template += '<a class="pointer" ng-click="hideTooltip($event)" data-placement="bottom" data-toggle="dropdown"><i class="fa fa-bars"></i></a>';
        template += '<ul class="dropdown-menu">';
        _.each(ctrl.getExtendedMenu(), function (item) {
          if (item.role === 'Editor' && !ctrl.dashboard.meta.canEdit) {
            return;
          }
          template += '<li><a class="pointer"';
          if (item.click) { template += ' ng-click="'+ item.click +'"'; }
          template += '>' + item.text + '</a></li>';
        });
        template += '</ul>';
        template += '</div>';
        template += '</div>';
        return template;
      }

      function getExtendedMenu(ctrl) {
        return ctrl.getExtendedMenu();
      }

      return {
        restrict: 'A',
        link: function($scope, elem) {
          var $link = $(linkTemplate);
          var $panelContainer = elem.parents(".panel-container");
          var menuScope = null;
          var ctrl = $scope.ctrl;
          var timeout = null;
          var $menu = null;
          var teather;

          elem.append($link);

          function dismiss(time, force) {
            clearTimeout(timeout);
            timeout = null;

            if (time) {
              timeout = setTimeout(dismiss, time);
              return;
            }

            // if hovering or draging pospone close
            if (force !== true) {
              if ($menu.is(':hover') || $scope.ctrl.dashboard.$$panelDragging) {
                dismiss(2200);
                return;
              }
            }

            if (menuScope) {
              teather.destroy();
              $menu.unbind();
              $menu.remove();
              menuScope.$destroy();
              menuScope = null;
              $menu = null;
              $panelContainer.removeClass('panel-highlight');
            }
          }

          // OLD
          // elem.append(createMenuTemplate(ctrl));

          // NEW
          var showMenu = function(e) {
            // if menu item is clicked and menu was just removed from dom ignore this event
            if (!$.contains(document, e.target)) {
              return;
            }

            if ($menu) {
              dismiss();
              return;
            }

            var menuTemplate;
            menuTemplate = createMenuTemplate(ctrl);

            $menu = $(menuTemplate);
            $menu.mouseleave(function() {
              dismiss(1000);
            });

            menuScope = $scope.$new();
            menuScope.extendedMenu = getExtendedMenu(ctrl);
            menuScope.dismiss = function() {
              dismiss(null, true);
            };

            $(".panel-container").removeClass('panel-highlight');
            $panelContainer.toggleClass('panel-highlight');

            $('.panel-menu').remove();

            elem.append($menu);

            $scope.$apply(function() {
              $compile($menu.contents())(menuScope);

              teather = new Tether({
                element: $menu,
                target: $panelContainer,
                attachment: 'bottom center',
                targetAttachment: 'top center',
                constraints: [
                  {
                    to: 'window',
                    attachment: 'together',
                    pin: true
                  }
                ]
              });
            });

            dismiss(2200);
          };

          elem.click(showMenu);
          $compile(elem.contents())($scope);
        }
      };
    });
});
