import {
  ReusableComponent,
  basicParameters,
} from '../types/d3-framework-types';
import { ID } from '../types/proxy-types';

class componentHandling {
  readonly g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private components: Map<string, Array<[basicParameters, ReusableComponent]>>; // map of components visualizing the replica

  constructor(g: d3.Selection<SVGGElement, unknown, HTMLElement, any>) {
    this.g = g;
    this.components = new Map();
  }

  private addComponent = (
    cmp: ReusableComponent,
    params: basicParameters
  ): void => {
    const { label } = params;
    const current = this.components.get(label)
      ? this.components.get(label)
      : [];
    this.components.set(label, [...current, [params, cmp]]);
  };

  addComponents = (
    cmps: Array<ReusableComponent>,
    params: basicParameters
  ): void => {
    cmps.forEach((cmp) => {
      const props = Object.getOwnPropertyNames(cmp);
      const newParams = {
        ...params,
        x: props.includes('caption') ? params.x - 50 : params.x,
      };
      this.addComponent(cmp, newParams);
    });
    console.log(
      this.components,
      'components in handler after adding components'
    );
  };

  drawAllComponents = (): void => {
    console.log('Drawing all the components');

    console.log(this.components, 'components in handler');

    this.components.forEach((arr, label) => {
      arr.forEach(([params, cmp]) => {
        const { x, y } = params;
        cmp.x(x).y(y).replicaId(label);
        this.g.call(cmp);
      });
    });
  };

  // TODO: fix merge implementation with component-handling
  positionMergedReplicas = () => {
    console.log('positioning merged replica in component handling');
    this.components.forEach((arr, label) => {
      arr.forEach(([params, cmp]) => {
        const { xMerge, yMerge } = params;
        cmp.x(xMerge).y(yMerge).replicaId(label);
        this.g.call(cmp);
      });
    });
  };

  drawMerge = (
    mergeG: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    components: Array<ReusableComponent>
  ): void => {};
}

export { componentHandling };
