// main d3 framework file, it defines and exports the main class

import { Strategy } from '../types/d3-framework-types';
import { StateInterface } from '../types/proxy-types';

export default class Framework {
  private strategy: Strategy; // visualization strategy

  constructor(crdtState: StateInterface) {}
}
