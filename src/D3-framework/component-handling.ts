import {
  ReusableComponent,
  basicParameters,
} from '../types/d3-framework-types';
import { ID } from '../types/proxy-types';
import { mergeArrows } from './Reusable-blocks/library/merge';

class componentHandling {
  readonly g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private components: Map<string, Array<[basicParameters, ReusableComponent]>>; // map of components visualizing the replica
  private padding = 15;

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
    this.components.delete(label);
    cmps.forEach((cmp) => {
      this.addComponent(cmp, params);
    });
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
  };

  // TODO: fix merge implementation with component-handling
  positionMergedReplicas = (position: number) => {
    console.log('positioning merged replica in component handling');
    let addX: number;
    switch (position) {
      case 1:
        addX = 0;
        break;
      case 2:
        addX = 450;
        break;
      default:
        throw Error('invalid position for merged replica');
    }
    this.components.forEach((arr, label) => {
      arr.forEach(([params, cmp], i) => {
        const { xMerge, yMerge } = params;
        if (i > 0) {
          const width = arr[i - 1][1].bbox().width;
          const oldX = arr[i - 1][1].x();
          const newX = Math.max(xMerge, oldX + width + this.padding);
          cmp.x(newX).y(yMerge).replicaId(label);
        } else {
          cmp
            .x(xMerge + addX)
            .y(yMerge)
            .replicaId(label);
        }
        this.g.call(cmp);
      });
    });
  };

  drawMerge = (
    mergeG: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  ): void => {
    const arrows = mergeArrows();
    mergeG.call(arrows);

    this.components.forEach((arr, label) => {
      arr.forEach(([params, cmp], i) => {
        const { xMerge, yMerge } = params;
        const addY = cmp.height() * 0.45;
        if (i > 0) {
          const width = arr[i - 1][1].bbox().width;
          const oldX = arr[i - 1][1].x();
          const newX = Math.max(xMerge, oldX + width + this.padding);
          cmp
            .x(newX)
            .y(yMerge + addY)
            .replicaId(label);
        } else {
          const addX = cmp.width() / 5;
          cmp
            .x(xMerge + addX)
            .y(yMerge + addY)
            .replicaId(label);
        }
        mergeG.call(cmp);
      });
    });
  };
}

export { componentHandling };
