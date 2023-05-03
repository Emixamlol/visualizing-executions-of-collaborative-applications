class componentHandling {
    constructor(g) {
        this.padding = 20;
        this.addComponent = (cmp, params) => {
            const { label } = params;
            const current = this.components.get(label)
                ? this.components.get(label)
                : [];
            this.components.set(label, [...current, [params, cmp]]);
        };
        this.addComponents = (cmps, params) => {
            const { label } = params;
            if (!this.components.has(label)) {
                cmps.forEach((cmp) => {
                    this.addComponent(cmp, params);
                });
            }
            console.log(this.components, 'components in handler after adding components');
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
            const children = this.g.selectChildren();
            for (let i = 0; i < children.size(); i++) {
                console.log(children.selectChildren(), 'children children');
            }
        };
        // TODO: fix merge implementation with component-handling
        this.positionMergedReplicas = () => {
            console.log('positioning merged replica in component handling');
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
                        cmp.x(xMerge).y(yMerge).replicaId(label);
                    }
                    this.g.call(cmp);
                });
            });
        };
        this.drawMerge = (mergeG, label) => {
            const arr = this.components.get(label);
            arr.forEach(([params, cmp], i) => {
                const { xMerge, yMerge } = params;
                if (i > 0) {
                    const width = arr[i - 1][1].bbox().width;
                    const oldX = arr[i - 1][1].x();
                    const newX = Math.max(xMerge, oldX + width + this.padding);
                    cmp.x(newX).y(yMerge).replicaId(label);
                }
                else {
                    cmp.x(xMerge).y(yMerge).replicaId(label);
                }
                mergeG.call(cmp);
            });
        };
        this.g = g;
        this.components = new Map();
    }
}
export { componentHandling };
