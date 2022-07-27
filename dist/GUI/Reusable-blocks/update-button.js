import * as d3 from 'd3';
export const updateButton = () => {
    let id;
    let methods;
    const listeners = d3.dispatch('click');
    const my = (selection) => {
        const htmlClass = 'crdt-update-methods';
        const form = selection
            .selectAll(`form.${htmlClass}`)
            .data([null])
            .join('form')
            .attr('class', htmlClass);
        const divs = form
            .selectAll(`div.${htmlClass}`)
            .data(methods)
            .join((enter) => enter.append('div').attr('class', htmlClass));
        const buttons = divs
            .selectAll(`button.${htmlClass}`)
            .data(({ fn, args }) => [{ fn, args }])
            .join('button')
            .attr('class', htmlClass)
            .attr('value', (d) => d.fn)
            .attr('type', 'button')
            .text((d) => d.fn)
            .on('click', (event, { fn }) => {
            const input = inputs
                .filter((d) => d.fn === fn)
                .node();
            const params = input
                ? input.value.split(/\s|\(|\)|,|\[|\]|=/i).filter((el) => el !== '')
                : [];
            if (input)
                input.value = '';
            listeners.call('click', null, [fn, params]);
        });
        const inputs = divs
            .filter((d) => d.args)
            .selectAll(`input.${htmlClass}`)
            .data(({ fn, args }) => [{ fn, args }])
            .join('input')
            .attr('class', htmlClass)
            .attr('type', 'text')
            .attr('id', (d) => d.fn);
        // remove labels that were there before
        divs
            .filter((d) => !d.args)
            .selectAll(`input.${htmlClass}`)
            .remove();
    };
    my.methods = function (_) {
        return arguments.length ? ((methods = _), my) : methods;
    };
    my.on = function () {
        const value = listeners.on.apply(listeners, arguments);
        return value === listeners ? my : value;
    };
    return my;
};
