export const valuePair = () => {
    let width;
    let height;
    let margin;
    let replicaId;
    const my = (selection) => {
        const htmlClass = 'crdt-value-pair';
    };
    my.width = function (_) {
        return arguments.length ? ((width = _), my) : width;
    };
    my.height = function (_) {
        return arguments.length ? ((height = _), my) : height;
    };
    my.margin = function (_) {
        return arguments.length ? ((margin = _), my) : margin;
    };
    my.replicaId = function (_) {
        return arguments.length ? ((replicaId = _), my) : replicaId;
    };
    return my;
};
