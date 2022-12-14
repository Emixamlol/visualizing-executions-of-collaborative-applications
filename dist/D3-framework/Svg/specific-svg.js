import * as d3 from 'd3';
import { flag } from '../Reusable-blocks/Patterns/flag';
import { set } from '../Reusable-blocks/Patterns/set';
import { tombstone } from '../Reusable-blocks/Patterns/tombstone';
// constants
const width = 500;
const height = 700;
const margin = { top: 20, right: 20, bottom: 20, left: 0 };
const radius = 25;
let replicaId; // the id of the current CRDT replica being visualized
// svg
const svg = d3
    .select('div.visualization > div.visualization-element')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
const sendReplicaId = (id) => {
    replicaId = id;
    console.log(`removing all elements which don't have id = ${id}`);
    svg.selectChildren(`:not(.${replicaId})`).remove();
};
const drawFlag = (enabled) => {
    const Flag = flag()
        .width(width)
        .height(height)
        .margin(margin)
        .enabled(enabled)
        .replicaId(replicaId);
    console.log(`svg calling Flag with value ${enabled} and id = ${Flag.replicaId()}`);
    svg.call(Flag);
};
const drawCounter = (value) => {
    const elements = [value.toString()];
    const tombstone = false;
    const Set = set()
        .width(width)
        .height(height)
        .margin(margin)
        .tombstone(tombstone)
        .elements(elements)
        .replicaId(replicaId);
    svg.call(Set);
};
const drawSet = (tombstone, elements) => {
    const Set = set()
        .width(width)
        .height(height)
        .margin(margin)
        .tombstone(tombstone)
        .elements(elements)
        .replicaId(replicaId);
    console.log(`svg calling Set with set = ${elements} and id = ${replicaId}`);
    svg.call(Set);
};
const drawTombstone = () => {
    const Tombstone = tombstone()
        .width(width)
        .height(height)
        .margin(margin)
        .replicaId(replicaId);
    console.log(`svg calling Tombstone with id = ${Tombstone.replicaId()}`);
    svg.call(Tombstone);
};
const drawValuePair = () => { };
export { sendReplicaId, drawFlag, drawCounter, drawSet, drawTombstone, drawValuePair, };
