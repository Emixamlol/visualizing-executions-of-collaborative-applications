class componentHandling {
    constructor(g) {
        this.addComponent = (cmp, params) => {
            const { label } = params;
            const current = this.components.get(label)
                ? this.components.get(label)
                : [];
            this.components.set(label, [...current, [params, cmp]]);
        };
        this.addComponents = (cmps, params) => {
            cmps.forEach((cmp) => {
                const props = Object.getOwnPropertyNames(cmp);
                const newParams = Object.assign(Object.assign({}, params), { x: props.includes('caption') ? params.x - 50 : params.x });
                this.addComponent(cmp, newParams);
            });
            console.log(this.components, 'components in handler after adding components');
        };
        this.drawAllComponents = () => {
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
        this.positionMergedReplicas = () => {
            console.log('positioning merged replica in component handling');
            this.components.forEach((arr, label) => {
                arr.forEach(([params, cmp]) => {
                    const { xMerge, yMerge } = params;
                    cmp.x(xMerge).y(yMerge).replicaId(label);
                    this.g.call(cmp);
                });
            });
        };
        this.drawMerge = (mergeG, components) => { };
        this.g = g;
        this.components = new Map();
    }
}
export { componentHandling };
