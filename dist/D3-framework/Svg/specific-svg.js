import * as d3 from 'd3';
import { getStartYs } from '../data-processing';
import { flag } from '../Reusable-blocks/library/flag';
import { label } from '../Reusable-blocks/library/label';
import { set } from '../Reusable-blocks/library/set';
import { timestamp as reusableTimestamp } from '../Reusable-blocks/library/timestamp';
import { tombstone } from '../Reusable-blocks/library/tombstone';
import { componentHandling } from '../component-handling';
import { singleValue } from '../Reusable-blocks/library/single-value';
const visualizationDiv = document.getElementById('visualization');
const dimensions = visualizationDiv.getBoundingClientRect();
// constants
const width = dimensions.width / 2; //500;
const height = dimensions.height; //700;
const margin = { top: 20, right: 20, bottom: 20, left: 0 };
const radius = 25;
const labelX = margin.left * 2 + 50;
const baseX = labelX + 50;
const svgClass = 'specific-svg';
// local information
let objecId = 'p'; // the id of the conceptual object represented by several replicas
let replicaId = 'p'; // the id of the current CRDT replica being visualized
let localData = [];
let replicas;
let startHeights;
let merge = false;
/**
 * map of replicas who are currently being visualized in the specific-svg, mapped to their handlers
 */
const handlerMap = new Map();
// svg
const svg = d3
    .select('div.visualization')
    .append('svg')
    .attr('id', svgClass)
    .attr('class', svgClass)
    .attr('width', width)
    .attr('height', height);
// group element visualizing the result of a merge
const mergeG = svg.append('g').attr('class', 'merge');
// ------------------------- update methods -------------------------
// update objectId
const sendObjectId = (id) => {
    console.log(`objectId = ${objecId}, sent id = ${id}`);
    if (objecId !== id) {
        svg.selectChildren('*').filter(':not(g.merge)').remove();
        mergeG.selectChildren('*').remove();
        handlerMap.clear();
    }
    objecId = id;
};
// update replicaId
const sendReplicaId = (id) => {
    replicaId = id;
    if (!handlerMap.has(id)) {
        const g = svg.append('g').attr('class', id);
        const handler = new componentHandling(g);
        handlerMap.set(id, handler);
    }
    mergeG.selectChildren('*').remove();
};
// update the data sent by the proxies
const update = (data) => {
    localData = data;
    replicas = data.map(([, replicas]) => replicas.map(({ id }) => id)).flat();
    const startYs = getStartYs(data, margin);
    startHeights = data
        .map(([, replicas], dataIndex) => replicas.map((d, replicaIndex) => startYs[dataIndex] + 25 + margin.top + 100 * replicaIndex))
        .flat();
};
const remove = (id) => {
    svg.selectAll(`g.${id}`).remove();
    handlerMap.delete(id);
};
const yValue = (replicaId) => {
    const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;
    return startHeights.at(index);
};
const mergeDone = () => {
    merge = false;
};
// ------------------------- draw methods -------------------------
// ----- help methods -----
const newLabel = (caption) => {
    return label()
        .width(width)
        .height(height)
        .margin(margin)
        .x(labelX)
        .y(yValue(replicaId))
        .replicaId(replicaId)
        .data(localData)
        .caption(caption);
};
const drawMergedReplica = () => {
    console.log(`drawing merged replica with merge = ${merge}`);
    const handler = handlerMap.get(replicaId);
    handler.drawMerge(mergeG);
};
const positionMergedReplicas = (senderId, receiverId) => {
    console.log(`positioning merged replicas with senderId = ${senderId}; receiverId = ${receiverId}`);
    merge = true;
    const [senderHandler, receiverHandler] = [
        handlerMap.get(senderId),
        handlerMap.get(receiverId),
    ];
    senderHandler.positionMergedReplicas(1);
    receiverHandler.positionMergedReplicas(2);
};
const drawReplicas = () => {
    console.log(handlerMap, 'handlerMap');
    // draw the currently active replicas
    handlerMap.forEach((handler, label) => {
        handler.drawAllComponents();
    });
};
// ----- component methods -----
const drawFlag = (params, enabled) => {
    const { label, x, y, color } = params;
    const Label = newLabel(replicaId);
    const Flag = flag()
        .width(width)
        .height(height)
        .margin(margin)
        .x(baseX)
        .y(yValue(replicaId))
        .enabled(enabled)
        .replicaId(replicaId)
        .data(localData);
    const components = [Label, Flag];
    handlerMap.get(replicaId).addComponents(components, Object.assign(Object.assign({}, params), { x: baseX + x, y: yValue(replicaId) + y }));
    if (merge) {
        drawMergedReplica();
    }
    else {
        drawReplicas();
    }
};
const drawSingleValue = (params, value) => {
    const { label, x, y } = params;
    const Label = newLabel(label);
    const Value = singleValue()
        .width(width)
        .height(height)
        .margin(margin)
        .x(baseX)
        .y(yValue(replicaId))
        .replicaId(replicaId)
        .data(localData)
        .value(value);
    const components = [Label, Value];
    handlerMap.get(replicaId).addComponents(components, Object.assign(Object.assign({}, params), { x: baseX + x, y: yValue(replicaId) + y }));
    if (merge) {
        drawMergedReplica();
    }
    else {
        drawReplicas();
    }
};
const drawCounter = (params, value, P) => {
    const { label, x, y, color } = params;
    const Label = newLabel(label);
    const Value = singleValue()
        .width(width)
        .height(height)
        .margin(margin)
        .x(x)
        .y(yValue(replicaId))
        .replicaId(replicaId)
        .data(localData)
        .value(value);
    const P_vector = reusableTimestamp()
        .width(width)
        .height(height)
        .margin(margin)
        .x(x)
        .y(yValue(replicaId))
        .data(localData)
        .replicaId(replicaId)
        .timestamp(P)
        .color(color);
    const components = [Label, Value, P_vector];
    handlerMap.get(replicaId).addComponents(components, Object.assign(Object.assign({}, params), { x: baseX + x, y: yValue(replicaId) + y }));
    if (merge) {
        drawMergedReplica();
    }
    else {
        drawReplicas();
    }
};
const drawRegister = (params, value, timestamp) => {
    const { label, x, y, color } = params;
    const Label = newLabel(replicaId);
    // [1,2,3].toString().split(',').map(el => parseInt(el)) = [1,2,3]
    const elements = value === undefined ? ['undefined'] : [value.toString()];
    const Set = set()
        .width(width)
        .height(height)
        .margin(margin)
        .x(baseX)
        .y(yValue(replicaId))
        .elements(elements)
        .replicaId(replicaId)
        .data(localData);
    const components = [Label, Set];
    handlerMap.get(replicaId).addComponents(components, Object.assign(Object.assign({}, params), { x: baseX + x, y: yValue(replicaId) + y }));
    console.log(handlerMap, 'handlerMap in register');
    if (merge) {
        drawMergedReplica();
    }
    else {
        console.log('drawing register');
        drawReplicas();
    }
};
const drawSet = (params, elements, tombstone) => {
    const { label, x, y, color } = params;
    const Label = newLabel(label);
    const Set = set()
        .width(width)
        .height(height)
        .margin(margin)
        .x(baseX)
        .y(yValue(replicaId))
        .elements(elements)
        .tombstone(tombstone !== undefined ? tombstone : [])
        .replicaId(replicaId)
        .data(localData);
    const components = [Label, Set];
    handlerMap.get(replicaId).addComponents(components, Object.assign(Object.assign({}, params), { x: baseX + x, y: yValue(replicaId) + y }));
    if (merge) {
        drawMergedReplica();
    }
    else {
        drawReplicas();
    }
};
const drawTombstone = (params) => {
    const { label, x, y, color } = params;
    const Label = newLabel(label);
    const Tombstone = tombstone()
        .width(width)
        .height(height)
        .margin(margin)
        .x(baseX)
        .y(yValue(replicaId))
        .replicaId(replicaId)
        .data(localData);
    const components = [Label, Tombstone];
    handlerMap.get(replicaId).addComponents(components, Object.assign(Object.assign({}, params), { x: baseX + x, y: yValue(replicaId) + y }));
    if (merge) {
        drawMergedReplica();
    }
    else {
        drawReplicas();
    }
};
const drawValuePair = (params) => { };
export { sendObjectId, sendReplicaId, update, mergeDone, drawFlag, drawSingleValue, drawCounter, drawRegister, drawSet, drawTombstone, drawValuePair, positionMergedReplicas, };
