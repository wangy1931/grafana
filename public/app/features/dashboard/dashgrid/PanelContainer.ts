import { DashboardModel } from '../dashboardModel';
import { PanelLoader } from './PanelLoader';

export interface PanelContainer {
  getPanelLoader(): PanelLoader;
  getDashboard(): DashboardModel;
}
