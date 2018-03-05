import { NavStore } from './../stores/NavStore/NavStore';
import { ViewStore } from './../stores/ViewStore/ViewStore';
import { RCA2Store } from './../stores/RCA2Store/RCA2Store';
import { AlertingStore } from './../stores/AlertStore/AlertingStore';
import { TopnStore } from 'app/stores/TopnStore/TopnStore';
import { GraphStore } from 'app/stores/PanelStore/GraphStore';

interface IContainerProps {
  nav: typeof NavStore.Type;
  view: typeof ViewStore.Type;
  rca2: typeof RCA2Store.Type;
  alerting: typeof AlertingStore.Type;
  topn: typeof TopnStore.Type;
  graph: typeof GraphStore.Type;
  backendSrv: any;
  popoverSrv: any;
  contextSrv: any;
}

export default IContainerProps;
