// main d3 framework file, it defines and exports the main class
import * as d3 from 'd3';

import { Strategy } from '../types/d3-framework-types';
import { StateInterface } from '../types/proxy-types';

export default class Framework {
  private strategy: Strategy; // visualization strategy

  constructor(crdtState: StateInterface) {}
}

const width = 500;
const height = 500;

export const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);
