import { mergeArrows } from './Reusable-blocks/library/merge';
class componentHandling {
    constructor(g) {
        this.padding = 15;
        this.addComponent = (cmp, params) => {
            const { label } = params;
            const current = this.components.get(label)
                ? this.components.get(label)
                : [];
            this.components.set(label, [...current, [params, cmp]]);
        };
        this.addComponents = (cmps, params) => {
            const { label } = params;
            this.components.delete(label);
            cmps.forEach((cmp) => {
                this.addComponent(cmp, params);
            });
        };
        this.drawAllComponents = () => {
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
                    }
                    else {
                        cmp.x(x).y(y).replicaId(label);
                    }
                    this.g.call(cmp);
                });
            });
        };
        // TODO: fix merge implementation with component-handling
        this.positionMergedReplicas = (position) => {
            console.log('positioning merged replica in component handling');
            let addX;
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
                    }
                    else {
                        cmp
                            .x(xMerge + addX)
                            .y(yMerge)
                            .replicaId(label);
                    }
                    this.g.call(cmp);
                });
            });
        };
        this.drawMerge = (mergeG) => {
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
                    }
                    else {
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
        this.g = g;
        this.components = new Map();
    }
}
export { componentHandling };
