import * as d3 from 'd3';
import { getStartYs } from '../data-processing';
import { flag } from '../Reusable-blocks/library/flag';
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
const svgClass = 'specific-svg';
// local information
let objecId = 'p'; // the id of the conceptual object represented by several replicas
let replicaId = 'p'; // the id of the current CRDT replica being visualized
let localData = [];
let replicas;
let startHeights;
// svg
const svg = d3
    .select('div.visualization')
    .append('svg')
    .attr('id', svgClass)
    .attr('class', svgClass)
    .attr('width', width)
    .attr('height', height);
// update objectId, replicaId and data
const sendObjectId = (id) => {
    console.log(`objectId = ${objecId}, sent id = ${id}`);
    if (objecId !== id) {
        console.log(`removing all elements in specific visualization`);
        svg.selectChildren('*').remove();
    }
    objecId = id;
};
const sendReplicaId = (id) => {
    console.log(`replicaId = ${replicaId}, id = ${id}`);
    replicaId = id;
    // console.log(`removing all elements which don't have id = ${id}`);
    // svg.selectChildren(`:not(.${replicaId})`).remove();
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
};
const yValue = () => {
    const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;
    return startHeights.at(index);
};
// draw methods
const drawFlag = (enabled) => {
    const Flag = flag()
        .width(width)
        .height(height)
        .margin(margin)
        .enabled(enabled)
        .replicaId(replicaId)
        .data(localData);
    console.log(`svg calling Flag with value ${enabled} and id = ${Flag.replicaId()}`);
    svg.call(Flag);
};
const drawCounter = (value, timestamp) => {
    const elements = [value.toString()];
    const Set = set()
        .width(width)
        .height(height)
        .margin(margin)
        .elements(elements)
        .replicaId(replicaId)
        .data(localData);
    const Timestamp = reusableTimestamp()
        .width(width)
        .height(height)
        .margin(margin)
        .data(localData)
        .replicaId(replicaId)
        .timestamp(timestamp);
    console.log(`svg calling counter with replicaId = ${replicaId}`);
    svg.call(Set).call(Timestamp);
};
const drawRegister = (value, timestamp) => {
    // [1,2,3].toString().split(',').map(el => parseInt(el)) = [1,2,3]
    const elements = value === undefined ? ['undefined'] : [value.toString()];
    const Set = set()
        .width(width)
        .height(height)
        .margin(margin)
        .elements(elements)
        .replicaId(replicaId)
        .data(localData);
    const Timestamp = reusableTimestamp()
        .width(width)
        .height(height)
        .margin(margin)
        .data(localData)
        .replicaId(replicaId)
        .timestamp(timestamp);
    console.log(`svg calling ValuePair with value = ${value}, valueId = ${timestamp} and replicaId = ${replicaId}`);
    svg.call(Set).call(Timestamp);
};
const drawSet = (elements, tombstone) => {
    const Set = set()
        .width(width)
        .height(height)
        .margin(margin)
        .elements(elements)
        .tombstone(tombstone !== undefined ? tombstone : [])
        .replicaId(replicaId)
        .data(localData);
    console.log(`svg calling Set with set = ${elements} and id = ${replicaId}`);
    svg.call(Set);
};
const drawTombstone = () => {
    const Tombstone = tombstone()
        .width(width)
        .height(height)
        .margin(margin)
        .replicaId(replicaId)
        .data(localData);
    console.log(`svg calling Tombstone with id = ${Tombstone.replicaId()}`);
    svg.call(Tombstone);
};
const drawValuePair = () => { };
export { sendObjectId, sendReplicaId, update, drawFlag, drawCounter, drawRegister, drawSet, drawTombstone, drawValuePair, };
