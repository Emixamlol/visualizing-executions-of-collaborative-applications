class componentHandling {
    constructor(g) {
        this.addComponents = (cmp, params) => {
            const { label } = params;
            this.components.set(label, [params, cmp]);
            console.log(this.components, 'components in handler after adding components');
        };
        this.drawAllComponents = () => {
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
        this.g = g;
        this.components = new Map();
    }
}
export { componentHandling };
