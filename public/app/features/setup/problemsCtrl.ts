
import coreModule from 'app/core/core_module';
import config from 'app/core/config';
import 'ng-quill';

class ProblemsCtrl {
  problems: Array<any>;

  /** @ngInject **/
  constructor() {
    this.problems = [{
      symptom: "<h3>Windows应用程序无法启动，因为应用程序的并行配置不正确。</h3><p><br></p><h3>有关详细信息，请参阅应用程序事件日志，或使用命令行 sxstrace.exe 工具。</h3>",
      solution: "<h3>1. 安装Microsoft Visual C++ 2008 Redistributable Package (x64)</h3><h3>\t微软官方下载地址：<a href=\"https://www.microsoft.com/en-us/download/details.aspx?id=15336\" target=\"_blank\">https://www.microsoft.com/en-us/download/details.aspx?id=15336</a> </h3><p><br></p><h3>2. 安装完成之后重新执行安装语句即可。</h3>"
    }];
  }

  editorCreated(editor, problem) {
    editor.root.innerHTML = problem;
  }

}

coreModule.controller('ProblemsCtrl', ProblemsCtrl);
