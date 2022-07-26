import * as d3 from 'd3';
import { getAllReplicas } from '../data-processing';
export const menu = () => {
    let id;
    let labelText;
    let data;
    let currentSelection;
    const listeners = d3.dispatch('change');
    const my = (selection) => {
        // process data
        const allReplicas = getAllReplicas(data);
        // visualization
        const htmlClass = 'replica-selection';
        selection
            .selectAll(`label.${htmlClass}`)
            .data([null])
            .join('label')
            .attr('class', htmlClass)
            .attr('for', id)
            .text(labelText);
        selection
            .selectAll(`select.${htmlClass}`)
            .data([null])
            .join('select')
            .attr('class', htmlClass)
            .attr('id', id)
            .on('change', (event) => {
            currentSelection = event.target.value;
        })
            .selectAll('option')
            .data(allReplicas)
            .join('option')
            .attr('value', (d) => d.id)
            .text((d) => d.id);
        currentSelection = selection
            .selectAll(`select.${htmlClass}`)
            .property('value');
    };
    my.id = function (_) {
        return arguments.length ? ((id = _), my) : id;
    };
    my.labelText = function (_) {
        return arguments.length ? ((labelText = _), my) : labelText;
    };
    my.data = function (_) {
        return arguments.length ? ((data = _), my) : data;
    };
    my.currentSelection = function (_) {
        return arguments.length ? ((currentSelection = _), my) : currentSelection;
    };
    my.on = function () {
        const value = listeners.on.apply(listeners, arguments);
        return value === listeners ? my : value;
    };
    return my;
};
