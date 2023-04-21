import * as d3 from 'd3';
import { getStartYs } from '../data-processing';
import { flag } from '../Reusable-blocks/library/flag';
import { label } from '../Reusable-blocks/library/label';
import { mergeArrows } from '../Reusable-blocks/library/merge';
import { set } from '../Reusable-blocks/library/set';
import { timestamp as reusableTimestamp } from '../Reusable-blocks/library/timestamp';
import { tombstone } from '../Reusable-blocks/library/tombstone';
import { componentHandling } from '../component-handling';
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
 * map of id to group elements. The latter contains the svg elements drawing the replica with that id
 */
const groupElements = new Map();
/**
 * map of replicas who are currently being visualized in the specific-svg, mapped to the Map of sub-elements visualizing them
 */
const activeVisualizations = new Map();
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
        console.log(`removing all elements (except merge group) in specific visualization`);
        svg.selectChildren('*').filter(':not(g.merge)').remove();
        mergeG.selectChildren('*').remove();
        handlerMap.clear();
        groupElements.clear();
        activeVisualizations.clear();
    }
    objecId = id;
};
// update replicaId
const sendReplicaId = (id) => {
    replicaId = id;
    if (!groupElements.has(id)) {
        const g = svg.append('g').attr('class', id);
        groupElements.set(id, g);
    }
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
    groupElements.delete(id);
    activeVisualizations.delete(id);
};
const yValue = (replicaId) => {
    const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;
    return startHeights.at(index);
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
const drawMergedReplica = (components) => {
    console.log(`drawing merged replica with merge = ${merge}`);
    merge = false;
    const addX = width / 5;
    const newY = height * 0.75;
    const arrows = mergeArrows();
    mergeG.call(arrows);
    components.forEach((component) => {
        const newX = component.x() + addX;
        component.x(newX);
        component.y(newY);
        mergeG.call(component);
    });
};
const positionMergedReplicas = (senderId, receiverId) => {
    console.log(`positioning merged replicas with senderId = ${senderId}; receiverId = ${receiverId}`);
    merge = true;
    const [senderHandler, receiverHandler] = [
        handlerMap.get(senderId),
        handlerMap.get(receiverId),
    ];
    senderHandler.positionMergedReplicas();
    receiverHandler.positionMergedReplicas();
    /* const addX = 400;
    const newY = height * 0.3;
  
    const [senderComponents, receiverComponents] = [
      activeVisualizations.get(senderId),
      activeVisualizations.get(receiverId),
    ];
  
    senderComponents.forEach((components, key) => {
      const g = groupElements.get(senderId);
      components.forEach((component) => {
        component.y(newY);
        g.call(component);
      });
    });
  
    receiverComponents.forEach((components, key) => {
      const g = groupElements.get(receiverId);
      components.forEach((component) => {
        const newX = component.x() + addX;
        component.x(newX);
        component.y(newY);
        g.call(component);
      });
    }); */
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
        drawMergedReplica(components);
    }
    else {
        drawReplicas();
    }
};
const drawCounter = (params, value, P) => {
    const { label, x, y, color } = params;
    const elements = [value.toString()];
    const Label = newLabel(label);
    const Set = set()
        .width(width)
        .height(height)
        .margin(margin)
        .x(x)
        .y(yValue(replicaId))
        .elements(elements)
        .replicaId(replicaId)
        .data(localData);
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
    const components = [Label, Set, P_vector];
    handlerMap.get(replicaId).addComponents(components, Object.assign(Object.assign({}, params), { x: baseX + x, y: yValue(replicaId) + y }));
    if (merge) {
        drawMergedReplica(components);
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
        drawMergedReplica(components);
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
        drawMergedReplica(components);
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
        drawMergedReplica(components);
    }
    else {
        drawReplicas();
    }
};
const drawValuePair = (params) => { };
export { sendObjectId, sendReplicaId, update, drawFlag, drawCounter, drawRegister, drawSet, drawTombstone, drawValuePair, positionMergedReplicas, };
