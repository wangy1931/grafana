import { react2AngularDirective } from 'app/core/utils/react2angular';
import SiderMenu from 'app/core/components/SiderMenu/SiderMenu';
import { BasicLayout } from 'app/core/components/BasicLayout/BasicLayout';
import GlobalHeader from 'app/core/components/GlobalHeader/GlobalHeader';

export function registerAngularDirectives() {
  react2AngularDirective('basicLayout', BasicLayout, ['context']);
  react2AngularDirective('siderMenu', SiderMenu, ['menuData',
  // 'collapsed',
  // 'onCollapse',
  ['collapsed', { watchDepth: 'value' }],
  ['onCollapse', { watchDepth: 'reference' }],
  'location']);
  react2AngularDirective('globalHeader', GlobalHeader, [
    // 'collapsed',
    ['collapsed', { watchDepth: 'value' }],
    ['onCollapse', { watchDepth: 'reference' }],
  ]);
}
