import * as d3 from 'd3';
import { rgb } from 'd3';
export const tombstone = () => {
    let x;
    let y;
    let width;
    let height;
    let margin;
    let replicaId;
    let data = [];
    const my = (selection) => {
        // set scales
        const replicas = data
            .map(([, replicas]) => replicas.map(({ id }) => id))
            .flat();
        const t = d3.transition().duration(1000);
        // process data
        // visualization
        const htmlClass = 'crdt-tombstone';
        const g = selection
            .selectAll(`g.${replicaId}`)
            .data([null])
            .join('g')
            .attr('class', replicaId);
        const positionTombstone = (path) => {
            path
                .attr('transform', 'rotate(-90, 20.26, 31.99)')
                .attr('stroke', rgb(0, 0, 0))
                .attr('d', 'M -12.09 11.36 L 31.99 11.36 Q 52.61 11.36 52.61 31.99 Q 52.61 52.61 31.99 52.61 L -12.09 52.61 Z');
        };
        const colorTombstone = (path) => {
            path.attr('fill', rgb(255, 255, 255));
        };
        g.selectAll(`path.${htmlClass}`)
            .data([null])
            .join((enter) => enter
            .append('path')
            .attr('id', 'tombstone')
            .attr('class', htmlClass)
            .call(positionTombstone)
            .call((enter) => enter.transition(t).call(colorTombstone)), (update) => update.call(positionTombstone).call(colorTombstone));
        const positionCross = (path) => {
            path
                .attr('stroke', rgb(0, 0, 0))
                .attr('d', 'M 11.5 17.25 L 18.5 17.25 L 18.5 9 L 22 9 L 22 17.25 L 29 17.25 L 29 20.75 L 22 20.75 L 22 29 L 18.5 29 L 18.5 20.75 L 11.5 20.75 Z');
        };
        const colorCross = (path) => {
            path.attr('fill', rgb(255, 255, 255));
        };
        g.selectAll('path#cross')
            .data([null])
            .join((enter) => enter
            .append('path')
            .attr('id', 'cross')
            .attr('class', replicaId)
            .call(positionCross)
            .call((enter) => enter.transition(t).call(colorCross)), (update) => update.call(positionCross).call(colorCross));
        // <g><path d="M -12.09 11.36 L 31.99 11.36 Q 52.61 11.36 52.61 31.99 Q 52.61 52.61 31.99 52.61 L -12.09 52.61 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" transform="rotate(-90,20.26,31.99)" pointer-events="all"/>
        // <path d="M 11.5 17.25 L 18.5 17.25 L 18.5 9 L 22 9 L 22 17.25 L 29 17.25 L 29 20.75 L 22 20.75 L 22 29 L 18.5 29 L 18.5 20.75 L 11.5 20.75 Z" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" stroke-miterlimit="10" pointer-events="all"/></g>
    };
    my.x = function (_) {
        return arguments.length ? ((x = _), my) : x;
    };
    my.y = function (_) {
        return arguments.length ? ((y = _), my) : y;
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
    my.data = function (_) {
        return arguments.length ? ((data = _), my) : data;
    };
    return my;
};
