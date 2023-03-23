import * as d3 from 'd3';
import { getStartYs } from '../data-processing';
import { flag } from '../Reusable-blocks/library/flag';
import { label } from '../Reusable-blocks/library/label';
import { mergeArrows } from '../Reusable-blocks/library/merge';
import { set } from '../Reusable-blocks/library/set';
import { timestamp as reusableTimestamp } from '../Reusable-blocks/library/timestamp';
import { tombstone } from '../Reusable-blocks/library/tombstone';
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
 * map of replicas who are currently being visualized in the specific-svg, mapped to the elements visualizing them
 */
const activeVisualizations = new Map();
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
// update objectId, replicaId and data
const sendObjectId = (id) => {
    console.log(`objectId = ${objecId}, sent id = ${id}`);
    if (objecId !== id) {
        console.log(`removing all elements (except merge group) in specific visualization`);
        svg.selectChildren('*').filter(':not(g.merge)').remove();
        mergeG.selectChildren('*').remove();
        activeVisualizations.clear();
    }
    objecId = id;
};
const sendReplicaId = (id) => {
    console.log(`replicaId = ${replicaId}, id = ${id}`);
    replicaId = id;
    mergeG.selectChildren('*').remove();
    console.log(`replicaId = ${replicaId}, id = ${id}`);
};
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
    activeVisualizations.delete(id);
};
const yValue = (replicaId) => {
    const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;
    return startHeights.at(index);
};
// ------------------------- draw methods -------------------------
// ----- help methods -----
const newLabel = () => {
    return label()
        .width(width)
        .height(height)
        .margin(margin)
        .x(labelX)
        .y(yValue(replicaId))
        .replicaId(replicaId)
        .data(localData);
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
    const addX = 400;
    const newY = height * 0.3;
    const [senderComponents, receiverComponents] = [
        activeVisualizations.get(senderId),
        activeVisualizations.get(receiverId),
    ];
    senderComponents.forEach((component) => {
        component.y(newY);
        svg.call(component);
    });
    receiverComponents.forEach((component) => {
        const newX = component.x() + addX;
        component.x(newX);
        component.y(newY);
        svg.call(component);
    });
};
const drawReplicas = () => {
    // draw the currently active replicas
    activeVisualizations.forEach((components, replicaId) => {
        components.forEach((component) => {
            const props = Object.getOwnPropertyNames(component);
            component
                .x(props.includes('label') ? labelX : baseX)
                .y(yValue(replicaId));
            svg.call(component);
        });
    });
};
// ----- component methods -----
const drawFlag = (enabled) => {
    const Label = newLabel();
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
    activeVisualizations.set(replicaId, components);
    console.log(`svg calling Flag with value ${enabled} and id = ${Flag.replicaId()}`);
    console.log(activeVisualizations);
    if (merge) {
        drawMergedReplica(components);
    }
    else {
        drawReplicas();
    }
};
const drawCounter = (value, timestamp) => {
    const elements = [value.toString()];
    const Label = newLabel();
    const Set = set()
        .width(width)
        .height(height)
        .margin(margin)
        .x(baseX)
        .y(yValue(replicaId))
        .elements(elements)
        .replicaId(replicaId)
        .data(localData);
    const Timestamp = reusableTimestamp()
        .width(width)
        .height(height)
        .margin(margin)
        .x(baseX)
        .y(yValue(replicaId))
        .data(localData)
        .replicaId(replicaId)
        .timestamp(timestamp);
    const components = [Label, Set, Timestamp];
    activeVisualizations.set(replicaId, components);
    console.log(`svg calling counter with replicaId = ${replicaId}`);
    console.log(activeVisualizations);
    if (merge) {
        drawMergedReplica(components);
    }
    else {
        // svg.call(Label).call(Set).call(Timestamp);
        drawReplicas();
    }
};
const drawRegister = (value, timestamp) => {
    const Label = newLabel();
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
    // TODO: get element widths
    const Timestamp = reusableTimestamp()
        .width(width)
        .height(height)
        .margin(margin)
        .x(baseX + 100)
        .y(yValue(replicaId))
        .data(localData)
        .replicaId(replicaId)
        .timestamp(timestamp);
    const components = [Label, Set, Timestamp];
    activeVisualizations.set(replicaId, components);
    console.log(`svg calling ValuePair with value = ${value}, valueId = ${timestamp} and replicaId = ${replicaId}`);
    console.log(activeVisualizations);
    if (merge) {
        drawMergedReplica(components);
    }
    else {
        drawReplicas();
    }
};
const drawSet = (elements, tombstone) => {
    const Label = newLabel();
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
    activeVisualizations.set(replicaId, components);
    console.log(`svg calling Set with set = ${elements} and id = ${replicaId}`);
    console.log(activeVisualizations);
    if (merge) {
        drawMergedReplica(components);
    }
    else {
        drawReplicas();
    }
};
const drawTombstone = () => {
    const Label = newLabel();
    const Tombstone = tombstone()
        .width(width)
        .height(height)
        .margin(margin)
        .x(baseX)
        .y(yValue(replicaId))
        .replicaId(replicaId)
        .data(localData);
    const components = [Label, Tombstone];
    activeVisualizations.set(replicaId, components);
    console.log(`svg calling Tombstone with id = ${Tombstone.replicaId()}`);
    console.log(activeVisualizations);
    if (merge) {
        drawMergedReplica(components);
    }
    else {
        drawReplicas();
    }
};
const drawValuePair = () => { };
export { sendObjectId, sendReplicaId, update, drawFlag, drawCounter, drawRegister, drawSet, drawTombstone, drawValuePair, positionMergedReplicas, };
