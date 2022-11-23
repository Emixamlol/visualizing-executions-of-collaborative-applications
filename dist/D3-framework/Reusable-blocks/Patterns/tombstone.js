export const tombstone = () => {
    let width;
    let height;
    let margin;
    const my = (selection) => {
        const htmlClass = 'crdt-tombstone';
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
