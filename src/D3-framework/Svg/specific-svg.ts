import * as d3 from 'd3';

import { Data } from '../../types/d3-framework-types';
import { ID } from '../../types/proxy-types';
import { flag } from '../Reusable-blocks/Patterns/flag';
import { tombstone } from '../Reusable-blocks/Patterns/tombstone';

// constants
const width = 500;
const height = 700;
const margin = { top: 20, right: 20, bottom: 20, left: 0 };
const radius = 25;

let replicaId: ID; // the id of the current CRDT replica being visualized

// svg
const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3
  .select('div.visualization > div.visualization-element')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const sendReplicaId = (id: ID): void => {
  replicaId = id;
  console.log(`removing all elements which don't have id = ${id}`);
  svg.selectChildren(`:not(.${replicaId})`).remove();
};

const drawFlag = (enabled: boolean): void => {
  const Flag = flag()
    .width(width)
    .height(height)
    .margin(margin)
    .enabled(enabled)
    .replicaId(replicaId);

  console.log(
    `svg calling Flag with value ${enabled} and id = ${Flag.replicaId()}`
  );

  svg.call(Flag);
};

const drawTombstone = (): void => {
  const Tombstone = tombstone()
    .width(width)
    .height(height)
    .margin(margin)
    .replicaId(replicaId);

  console.log(`svg calling Tombstone with id = ${Tombstone.replicaId()}`);

  svg.call(Tombstone);
};

const drawValuePair = (): void => {};

export { sendReplicaId, drawFlag, drawTombstone, drawValuePair };
