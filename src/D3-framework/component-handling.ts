import {
  ReusableComponent,
  basicParameters,
} from '../types/d3-framework-types';
import { ID } from '../types/proxy-types';

class componentHandling {
  readonly g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private components: Map<string, Array<[basicParameters, ReusableComponent]>>; // map of components visualizing the replica
  private padding = 20;

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
    const { label } = params;
    if (!this.components.has(label)) {
      cmps.forEach((cmp) => {
        this.addComponent(cmp, params);
      });
    }

    console.log(
      this.components,
      'components in handler after adding components'
    );
  };

  drawAllComponents = (): void => {
    console.log('Drawing all the components');
    console.log(this.components, 'components in handler');

    this.components.forEach((arr, label) => {
      arr.forEach(([params, cmp], i) => {
        const { x, y } = params;
        if (i > 0) {
          const width = arr[i - 1][1].bbox().width;
          const oldX = arr[i - 1][1].x();
          const newX = Math.max(x, oldX + width + this.padding);
          cmp.x(newX).y(y).replicaId(label);
        } else {
          cmp.x(x).y(y).replicaId(label);
        }
        this.g.call(cmp);
      });
    });

    const children = this.g.selectChildren();
    for (let i = 0; i < children.size(); i++) {
      console.log(children.selectChildren(), 'children children');
    }
  };

  // TODO: fix merge implementation with component-handling
  positionMergedReplicas = () => {
    console.log('positioning merged replica in component handling');
    this.components.forEach((arr, label) => {
      arr.forEach(([params, cmp], i) => {
        const { xMerge, yMerge } = params;
        if (i > 0) {
          const width = arr[i - 1][1].bbox().width;
          const oldX = arr[i - 1][1].x();
          const newX = Math.max(xMerge, oldX + width + this.padding);
          cmp.x(newX).y(yMerge).replicaId(label);
        } else {
          cmp.x(xMerge).y(yMerge).replicaId(label);
        }
        this.g.call(cmp);
      });
    });
  };

  drawMerge = (
    mergeG: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    label: string
  ): void => {
    const arr = this.components.get(label);
    arr.forEach(([params, cmp], i) => {
      const { xMerge, yMerge } = params;
      if (i > 0) {
        const width = arr[i - 1][1].bbox().width;
        const oldX = arr[i - 1][1].x();
        const newX = Math.max(xMerge, oldX + width + this.padding);
        cmp.x(newX).y(yMerge).replicaId(label);
      } else {
        cmp.x(xMerge).y(yMerge).replicaId(label);
      }
      mergeG.call(cmp);
    });
  };
}

export { componentHandling };
