import {
  ReusableComponents,
  basicParameters,
} from '../types/d3-framework-types';
import { ID } from '../types/proxy-types';

class componentHandling {
  readonly g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private components: Map<string, [basicParameters, ReusableComponents]>; // map of components visualizing the replica

  constructor(g: d3.Selection<SVGGElement, unknown, HTMLElement, any>) {
    this.g = g;
    this.components = new Map();
  }

  addComponents = (cmp: ReusableComponents, params: basicParameters): void => {
    const { label } = params;
    this.components.set(label, [params, cmp]);
    console.log(
      this.components,
      'components in handler after adding components'
    );
  };

  drawAllComponents = (): void => {
    console.log('Drawing all the components');

    console.log(this.components, 'components in handler');

    this.components.forEach(([params, cmps], label) => {
      cmps.forEach((cmp) => {
        const { x, y } = params;
        cmp.x(x).y(y).replicaId(label);
        this.g.call(cmp);
      });
    });
  };
}

export { componentHandling };
