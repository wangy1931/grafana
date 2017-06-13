define([
  'moment',
  'jquery',
  'angular',
  'lodash',
  'ui.calendar',
  'zh-cn',
],
function (moment, $, angular, _, uiCalendarConfig) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('OnCallerScheduleCtrl', function ($scope, oncallerMgrSrv) {
    /* oncaller/events
      {
        title: name,       << 显示名称
        start: start,
        end: end,
        id: id,             << 人员id,添加修改时使用
        name: name,         << 后端返回时携带的,这里赋值给title,以供显示
        stick: true,        << 保证events停留在view上，为repeat处理服务
        className: [],      << 这里单纯为了记录角色,其他自定义属性也可以
        color/textColor: color, <<  控制展示颜色,可由前端设置
      }
    */
    var colors = {
      user0:['#89c4f4','#43a1ed'],
      user1:['#ffd990','#ffbf43'],
      user2:['#fd8b8b','#fc4040'],
      user3:['#20ae72','#146d48'],
      user4:['#ffcd4e','#ffb701'],
    };

    $scope.init = function() {
      $scope.primary = {
        type: '(主)',
        events: []
      };
      $scope.secondary = {
        type: '(次)',
        events: []
      };
      $scope.primaryReview = {
        type: '(主)',
        events: []
      };
      $scope.secondaryReview = {
        type: '(次)',
        events: []
      };
      $scope.roles = [
        {key:'primary',val:'值班',},
        {key:'secondary',val:'候选',},
        {key:'primaryReview',val:'值班',},
        {key:'secondaryReview',val:'候选',},
      ];

      $scope.oncallerDefList = null;
      $scope.role = $scope.roles[1];
      $scope.showEditForm = false;
      $scope.oncallerSelcted = null;
      $scope.oncallerList = [];
      $scope.range = 7;
      $scope.changeTimeList = [];
      for(var i=0; i<24; i++){
        var t = i<10 ? '0'+i : i;
        $scope.changeTimeList.push({key: i, value: t + ':00:00'});
      }
      $scope.changeTime = $scope.changeTimeList[8];
      /* config object uiConfig defined after the event */
      $scope.uiConfig = {
        calendar: {
          height: 450,
          editable: true,
          locale: 'zh-cn',
          monthNames: moment.months(),
          monthNamesShort: moment.monthsShort(),
          dayNames: moment.weekdays(),
          dayNamesShort: moment.weekdaysShort(),
          header: {
            left: '',
            center: 'title',
          },
          eventClick: eventClick,
          viewRender: viewRender,
          eventMouseover: eventMouseover,
          eventMouseout: eventMouseout,
        }
      };

      $scope.eventSources = [$scope.primary,$scope.secondary,$scope.primaryReview,$scope.secondaryReview];

      oncallerMgrSrv.load().then(function onSuccess(response) {
        $scope.oncallerDefList = response.data;
        for(var i in $scope.oncallerDefList){
          var user = 'user'+(i % Object.keys(colors).length);
          $scope.oncallerDefList[i].user = user;
        }
      });
    };

    function addEvent(oncaller, role) {
      oncaller.textColor = '#fff';
      oncaller.title += $scope[role].type;
      oncaller.className = [];
      oncaller.className.push(role);
      var index = _.findIndex($scope[role].events,{start:oncaller.start});
      if(index == (-1 || undefined)){
        $scope[role].events.push(oncaller);
        if(!oncaller.end){
          var len = $scope[role].events.length;
          if(len < 2){
            return;
          } else {
            $scope[role].events[len-2].end = oncaller.start;
          }
        }
      } else {
        var event = $scope[role].events[index];
        event.title = oncaller.title;
        event.start = oncaller.start;
        event.end = oncaller.end;
        event.color = oncaller.color;
      }
    }

    function getTimeSec(time) {
      return new Date(time).valueOf()/1000;
    }

    function formatTime(time) {
      if(time){
        return moment(time).format('YYYY-MM-DDTHH:mm:ss');
      } else {
        return '';
      }
    }

    function eventClick(date, jsEvent, view) {
      $scope.showEditForm = true;
      $scope.overwrite = true;
      $scope.startTime = formatTime(date.start);
      $scope.endTime = formatTime(date.end);
      $scope.role = _.find($scope.roles,{key: date.className[0]});
      $scope.oncallerSelcted = _.find($scope.oncallerDefList, {id: date.id});
    };

    function viewRender(view, element) {
      var today = new Date();
      $scope.primary.events = [];
      $scope.secondary.events = [];
      $scope.zonesStart = new Date(view.start._d);
      $scope.zonesEnd = new Date(view.end._d);
      if(today.getTime() > $scope.zonesEnd.getTime()) {
        $scope.zonesStart = today;
        $scope.zonesEnd = today;
      } else if(today.getTime() > $scope.zonesStart.getTime()) {
        $scope.zonesStart = today;
        $scope.zonesEnd.setDate(1);
      } else {
        $scope.zonesStart.setDate(1);
        $scope.zonesEnd.setDate(1);
        $scope.zonesStart.setMonth($scope.zonesStart.getMonth()+1);
      }
      $scope.zonesStart = moment($scope.zonesStart).format('YYYY-MM-DD');
      $scope.zonesEnd = moment($scope.zonesEnd).format('YYYY-MM-DD');
      oncallerMgrSrv.loadSchedule(getTimeSec(view.start._d), getTimeSec(view.end._d)).then(function onSuccess(response) {
        _.each(response.data.roleSchedule, function(roleEvents, role) {
          _.each(roleEvents, function(oncaller, start) {
            oncaller.start = new Date(parseInt(start)*1000);
            oncaller.title = oncaller.name;
            oncaller.color = colors[_.find($scope.oncallerDefList, {id: oncaller.id}).user][0];
            addEvent(oncaller, role);
          });
        });
      });
    };

    function eventMouseover(event, jsEvent, view) {
      this.style.backgroundColor = '#eee';
    };

    function eventMouseout(event, jsEvent, view) {
      this.style.backgroundColor = event.color;
    };

    $scope.addSchedule = function(role,oncallerSelcted) {
      var oncaller = {
        title: oncallerSelcted.name,
        start: new Date($scope.startTime),
        end: new Date($scope.endTime),
        id: oncallerSelcted.id,
        color: oncallerSelcted.user[0]
      }
      addEvent(oncaller, role.key);
      updateSchedule(role.key, oncaller);
      $scope.closeEdit();
    }

    $scope.closeEdit = function() {
      $scope.showEditForm = false;
      $scope.overwrite = false;
      $scope.addoncaller = false;
    }

    $scope.showOncallers = function() {
      if($scope.oncallerList.length == $scope.oncallerDefList.length) {
        $scope.appEvent('alert-warning', ['您已添加所有值班人员']);
      } else {
        $scope.showEditForm = true;
        $scope.addoncaller = true;
      }
    };

    $scope.addOncallers = function() {
      var index = _.findIndex($scope.oncallerList,$scope.oncallerSelcted);
      if(index == -1){
        $scope.oncallerSelcted.color = colors[$scope.oncallerSelcted.user];
        $scope.oncallerList.push($scope.oncallerSelcted);
        $scope.closeEdit();
        $scope.reviewSchedule();
      } else {
        $scope.appEvent('alert-warning', ['您已添加该值班人员','请重新选择']);
      }
    };

    $scope.chooseOncallers = function(oncaller) {
      $scope.oncallerSelcted = oncaller;
    }

    $scope.deleteOncaller = function(oncallerSelcted) {
      _.pull($scope.oncallerList,oncallerSelcted);
      if($scope.oncallerList.length){
        $scope.reviewSchedule();
      } else {
        $scope.primary.events = [];
        $scope.secondary.events = [];
      }
    };

    $scope.clearReview = function() {
      while($scope.primaryReview.events.length){
        $scope.primaryReview.events.pop();
        $scope.secondaryReview.events.pop();
      }
    }

    $scope.reviewSchedule = function() {
      $scope.clearReview();
      var zonesStart = new Date($scope.zonesStart);
      zonesStart.setHours($scope.changeTime.key);
      var zonesEnd = new Date($scope.zonesEnd);
      zonesEnd.setHours($scope.changeTime.key);
      var num = (zonesEnd.getTime() - zonesStart.getTime())/(1000*60*60*24)/$scope.range;
      for(var i=0; i<num; i++){
        var start = new Date(zonesStart).setDate(zonesStart.getDate()+i*$scope.range);
        var end = new Date(zonesStart).setDate(zonesStart.getDate()+(i+1)*$scope.range);
        var pri = $scope.oncallerList[i%$scope.oncallerList.length];
        var oncallerPri = {
          title: pri.name,
          stick: true,
          start: formatTime(start),
          end: formatTime(end),
          id: pri.id,
          color: pri.color[0],
        };
        addEvent(oncallerPri, 'primaryReview');
        var sec = $scope.oncallerList[(i+1)%$scope.oncallerList.length];
        var oncallerSec = {
          title: sec.name,
          stick: true,
          start: formatTime(start+1000),
          end: formatTime(end),
          id: sec.id,
          color: sec.color[0],
        }
        addEvent(oncallerSec, 'secondaryReview');
      };
    };

    $scope.saveSchedule = function() {
      while($scope.primaryReview.events.length) {
        updateSchedule('primary',$scope.primaryReview.events.pop());
        updateSchedule('secondary',$scope.secondaryReview.events.pop());
      };
    };

    var updateSchedule = function(role,oncallerSelcted) {
      oncallerSelcted.stick = false;
      oncallerSelcted.title = oncallerSelcted.title.substring(0,oncallerSelcted.title.length-3);
      addEvent(oncallerSelcted, role);
      oncallerMgrSrv.updateSchedule(role, oncallerSelcted.id, getTimeSec(oncallerSelcted.start), getTimeSec(oncallerSelcted.end));
    }

    $scope.init();
  });
});
