define([
  '../core_module',
  'app/core/utils/kbn',
],
function (coreModule, kbn) {
  'use strict';

  kbn = kbn.default;

  coreModule.default.directive('dashUpload', function(timer, alertSrv, $location) {
    return {
      restrict: 'A',
      link: function(scope) {
        function file_selected(evt) {
          var files = evt.target.files; // FileList object
          var readerOnload = function() {
            return function(e) {
              scope.$apply(function() {
                try {
                  window.grafanaImportDashboard = JSON.parse(e.target.result);
                } catch (err) {
                  console.log(err);
                  scope.appEvent('alert-error', ['导入 失败', 'JSON -> JS Serialization failed: ' + err.message]);
                  return;
                }
                var title = kbn.slugifyForUrl(window.grafanaImportDashboard.title);
                title += new Date().getTime();
                window.grafanaImportDashboard.id = null;
                $location.path('/dashboard-import/' + title);
              });
            };
          };
          for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            reader.onload = (readerOnload)(f);
            reader.readAsText(f);
          }
        }
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          // Something
          document.getElementById('dashupload').addEventListener('change', file_selected, false);
        } else {
          alertSrv.set('非常抱歉','上传失败, 您的浏览器版本过低,请换最新的谷歌浏览器/火狐浏览器','error');
        }
      }
    };
  });
});
