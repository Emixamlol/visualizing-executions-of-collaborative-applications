import * as d3 from 'd3';

import { Data } from '../../types/d3-framework-types';
import { ID } from '../../types/proxy-types';
import { flag } from '../Reusable-blocks/Patterns/flag';
import { set } from '../Reusable-blocks/Patterns/set';
import { tombstone } from '../Reusable-blocks/Patterns/tombstone';
import { valuePair } from '../Reusable-blocks/Patterns/value-pair';

// constants
const width = 500;
const height = 700;
const margin = { top: 20, right: 20, bottom: 20, left: 0 };
const radius = 25;
const svgClass = 'specific-svg';

let replicaId: ID; // the id of the current CRDT replica being visualized
let localData: Data = [];

// svg
const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3
  .select('div.visualization > div.visualization-element')
  .append('svg')
  .attr('id', svgClass)
  .attr('class', svgClass)
  .attr('width', width)
  .attr('height', height);

// update replica and data
const sendReplicaId = (id: ID): void => {
  console.log(`replicaId = ${replicaId}, id = ${id}`);
  replicaId = id;
  console.log(`removing all elements which don't have id = ${id}`);
  svg.selectChildren(`:not(.${replicaId})`).remove();
  console.log(`replicaId = ${replicaId}, id = ${id}`);
};

const update = (data: Data): void => {
  localData = data;
};

// draw methods
const drawFlag = (enabled: boolean): void => {
  const Flag = flag()
    .width(width)
    .height(height)
    .margin(margin)
    .enabled(enabled)
    .replicaId(replicaId)
    .data(localData);

  console.log(
    `svg calling Flag with value ${enabled} and id = ${Flag.replicaId()}`
  );

  svg.call(Flag);
};

const drawCounter = (value: number) => {
  const elements = [value.toString()];
  const tombstone = false;

  const Set = set()
    .width(width)
    .height(height)
    .margin(margin)
    .tombstone(tombstone)
    .elements(elements)
    .replicaId(replicaId)
    .data(localData);

  console.log(`svg calling counter with replicaId = ${replicaId}`);

  svg.call(Set);
};

const drawRegister = (value: string, timestamp: number[]): void => {
  const tuple: [string, ID] = [value, timestamp.toString()];

  // [1,2,3,4].toString().split(',').map(el => parseInt(el))

  const ValuePair = valuePair()
    .width(width)
    .height(height)
    .margin(margin)
    .replicaId(replicaId)
    .data(localData)
    .tuples([tuple]);

  console.log(
    `svg calling ValuePair with value = ${value}, valueId = ${timestamp} and replicaId = ${replicaId}`
  );

  svg.call(ValuePair);
};

const drawSet = (tombstone: boolean, elements: Array<string>): void => {
  const Set = set()
    .width(width)
    .height(height)
    .margin(margin)
    .tombstone(tombstone)
    .elements(elements)
    .replicaId(replicaId)
    .data(localData);

  console.log(`svg calling Set with set = ${elements} and id = ${replicaId}`);

  svg.call(Set);
};

const drawTombstone = (): void => {
  const Tombstone = tombstone()
    .width(width)
    .height(height)
    .margin(margin)
    .replicaId(replicaId)
    .data(localData);

  console.log(`svg calling Tombstone with id = ${Tombstone.replicaId()}`);

  svg.call(Tombstone);
};

const drawValuePair = (): void => {};

export {
  sendReplicaId,
  update,
  drawFlag,
  drawCounter,
  drawRegister,
  drawSet,
  drawTombstone,
  drawValuePair,
};
