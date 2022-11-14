export const valuePair = () => {
    let width;
    let height;
    let margin;
    const my = (selection) => { };
    my.width = function (_) {
        arguments.length ? ((width = _), my) : width;
    };
    my.height = function (_) {
        arguments.length ? ((height = _), my) : height;
    };
    my.margin = function (_) {
        arguments.length ? ((margin = _), my) : margin;
    };
    return my;
};
