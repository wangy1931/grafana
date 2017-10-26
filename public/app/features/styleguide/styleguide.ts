
import coreModule from 'app/core/core_module';
import config from 'app/core/config';
import _ from 'lodash';

class StyleGuideCtrl {
  colors: any = [];
  theme: string;
  buttonNames = ['primary', 'secondary', 'inverse', 'success', 'warning', 'danger'];
  buttonSizes = ['btn-small', '', 'btn-large'];
  buttonVariants = ['-', '-outline-'];
  page: any;
  pages = ['colors', 'buttons', 'forms', 'dashboard', 'query-editors', 'cloudwiz'];
  cloudwiz: any;

  /** @ngInject **/
  constructor(private $http, $routeParams) {
    this.theme = config.bootData.user.lightTheme ? 'light': 'dark';
    this.page = {};

    if ($routeParams.page) {
      this.page[$routeParams.page] = 1;
    } else {
      this.page.colors = true;
    }

    if (this.page.colors) {
      this.loadColors();
    }

    // $thresholds-color: (#66C2A5, #FEE08B, #FDAE61, #FE9805, #D53E4F, #DBE1EA, #6FCDFB);
    // $thresholds-hover-color: (#3DB779, #FFD500, #FE9805, #ff4f45, #BB1144, #BABFC7, #18BEEA);
    this.cloudwiz = {
      thresholdsColor: ['#66C2A5', '#FEE08B', '#FDAE61', '#FE9805', '#D53E4F', '#DBE1EA', '#6FCDFB'],
      thresholdsHoverColor: ['#3DB779', '#FFD500', '#FE9805', '#ff4f45', '#BB1144', '#BABFC7', '#18BEEA']
    }
  }

  loadColors() {
   this.$http.get('public/sass/styleguide.json').then(res => {
      this.colors = _.map(res.data[this.theme], (value, key) => {
        return {name: key, value: value};
      });
    });
  }

  switchTheme() {
    var other = this.theme === 'dark' ? 'light' : 'dark';
    window.location.href = window.location.href + '?theme=' + other;
  }

}

coreModule.controller('StyleGuideCtrl', StyleGuideCtrl);
