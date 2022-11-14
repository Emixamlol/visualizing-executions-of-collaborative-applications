export const flag = () => {
    let width;
    let height;
    let margin;
    const my = (selection) => {
        const htmlClass = 'crdt-flag';
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
    return my;
};
