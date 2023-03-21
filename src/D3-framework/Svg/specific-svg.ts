import * as d3 from 'd3';

import {
  Data,
  ReusableComponents,
  ReusableLabel,
} from '../../types/d3-framework-types';
import { ID } from '../../types/proxy-types';
import { getStartYs } from '../data-processing';
import { flag } from '../Reusable-blocks/library/flag';
import { label } from '../Reusable-blocks/library/label';
import { set } from '../Reusable-blocks/library/set';
import { timestamp as reusableTimestamp } from '../Reusable-blocks/library/timestamp';
import { tombstone } from '../Reusable-blocks/library/tombstone';
import { valuePair } from '../Reusable-blocks/library/value-pair';

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
let objecId: ID = 'p'; // the id of the conceptual object represented by several replicas
let replicaId: ID = 'p'; // the id of the current CRDT replica being visualized
let localData: Data = [];
let replicas: Array<ID>;
let startHeights: Array<number>;
let merge: boolean = false;

/**
 * map of replicas who are currently being visualized in the specific-svg, mapped to the elements visualizing them
 */
const activeVisualizations: Map<ID, ReusableComponents> = new Map();

// svg
const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> = d3
  .select('div.visualization')
  .append('svg')
  .attr('id', svgClass)
  .attr('class', svgClass)
  .attr('width', width)
  .attr('height', height);

// group element visualizing the result of a merge
const mergeG = svg.append('g').attr('class', 'merge');

// update objectId, replicaId and data
const sendObjectId = (id: ID): void => {
  console.log(`objectId = ${objecId}, sent id = ${id}`);
  if (objecId !== id) {
    console.log(
      `removing all elements (except merge group) in specific visualization`
    );
    svg.selectChildren('*').filter(':not(g.merge)').remove();
    activeVisualizations.clear();
  }
  objecId = id;
};

const sendReplicaId = (id: ID): void => {
  console.log(`replicaId = ${replicaId}, id = ${id}`);
  replicaId = id;
  console.log(`replicaId = ${replicaId}, id = ${id}`);
};

const update = (data: Data): void => {
  localData = data;

  replicas = data.map(([, replicas]) => replicas.map(({ id }) => id)).flat();

  const startYs = getStartYs(data, margin);
  startHeights = data
    .map(([, replicas], dataIndex) =>
      replicas.map(
        (d, replicaIndex) =>
          startYs[dataIndex] + 25 + margin.top + 100 * replicaIndex
      )
    )
    .flat();
};

const remove = (id: ID): void => {
  svg.selectAll(`g.${id}`).remove();
  activeVisualizations.delete(id);
};

const yValue = (): number => {
  const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;
  return startHeights.at(index);
};

// ------------------------- draw methods -------------------------

// help methods
const newLabel = (): ReusableLabel => {
  return label()
    .width(width)
    .height(height)
    .margin(margin)
    .x(labelX)
    .y(yValue())
    .replicaId(replicaId)
    .data(localData);
};

const drawMergedReplica = (components: ReusableComponents): void => {
  console.log(`drawing merged replica with merge = ${merge}`);

  merge = false;
  const addX = width / 5;
  const newY = height * 0.6;

  components.forEach((component) => {
    const newX = component.x() + addX;
    component.x(newX);
    component.y(newY);
    mergeG.call(component);
  });
};

const positionMergedReplicas = (senderId: ID, receiverId: ID): void => {
  console.log(
    `positioning merged replicas with senderId = ${senderId}; receiverId = ${receiverId}`
  );

  merge = true;
  const addX = 400;
  const newY = 80;

  const [senderComponents, receiverComponents] = [
    activeVisualizations.get(senderId),
    activeVisualizations.get(receiverId),
  ];

  senderComponents.forEach((component) => {
    const newY = 80;
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

// main methods
const drawFlag = (enabled: boolean): void => {
  const Label = newLabel();

  const Flag = flag()
    .width(width)
    .height(height)
    .margin(margin)
    .x(baseX)
    .y(yValue())
    .enabled(enabled)
    .replicaId(replicaId)
    .data(localData);

  const components = [Label, Flag];

  activeVisualizations.set(replicaId, components);

  console.log(
    `svg calling Flag with value ${enabled} and id = ${Flag.replicaId()}`
  );
  console.log(activeVisualizations);

  if (merge) {
    drawMergedReplica(components);
  } else {
    svg.call(Label).call(Flag);
  }
};

const drawCounter = (value: number, timestamp: Array<number>) => {
  const elements = [value.toString()];

  const Label = newLabel();

  const Set = set()
    .width(width)
    .height(height)
    .margin(margin)
    .x(baseX)
    .y(yValue())
    .elements(elements)
    .replicaId(replicaId)
    .data(localData);

  const Timestamp = reusableTimestamp()
    .width(width)
    .height(height)
    .margin(margin)
    .x(baseX)
    .y(yValue())
    .data(localData)
    .replicaId(replicaId)
    .timestamp(timestamp);

  const components = [Label, Set, Timestamp];

  activeVisualizations.set(replicaId, components);

  console.log(`svg calling counter with replicaId = ${replicaId}`);
  console.log(activeVisualizations);

  if (merge) {
    drawMergedReplica(components);
  } else {
    svg.call(Label).call(Set).call(Timestamp);
  }
};

const drawRegister = (value: string, timestamp: Array<number>): void => {
  const Label = newLabel();

  // [1,2,3].toString().split(',').map(el => parseInt(el)) = [1,2,3]

  const elements = value === undefined ? ['undefined'] : [value.toString()];

  const Set = set()
    .width(width)
    .height(height)
    .margin(margin)
    .x(baseX)
    .y(yValue())
    .elements(elements)
    .replicaId(replicaId)
    .data(localData);

  const Timestamp = reusableTimestamp()
    .width(width)
    .height(height)
    .margin(margin)
    .x(baseX)
    .y(yValue())
    .data(localData)
    .replicaId(replicaId)
    .timestamp(timestamp);

  const components = [Label, Set, Timestamp];

  activeVisualizations.set(replicaId, components);

  console.log(
    `svg calling ValuePair with value = ${value}, valueId = ${timestamp} and replicaId = ${replicaId}`
  );
  console.log(activeVisualizations);

  if (merge) {
    drawMergedReplica(components);
  } else {
    svg.call(Label).call(Set).call(Timestamp);
  }
};

const drawSet = (elements: Array<string>, tombstone?: Array<string>): void => {
  const Label = newLabel();

  const Set = set()
    .width(width)
    .height(height)
    .margin(margin)
    .x(baseX)
    .y(yValue())
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
  } else {
    svg.call(Label).call(Set);
  }
};

const drawTombstone = (): void => {
  const Label = newLabel();

  const Tombstone = tombstone()
    .width(width)
    .height(height)
    .margin(margin)
    .x(baseX)
    .y(yValue())
    .replicaId(replicaId)
    .data(localData);

  const components = [Label, Tombstone];

  activeVisualizations.set(replicaId, components);

  console.log(`svg calling Tombstone with id = ${Tombstone.replicaId()}`);
  console.log(activeVisualizations);

  if (merge) {
    drawMergedReplica(components);
  } else {
    svg.call(Label).call(Tombstone);
  }
};

const drawValuePair = (): void => {};

export {
  sendObjectId,
  sendReplicaId,
  update,
  drawFlag,
  drawCounter,
  drawRegister,
  drawSet,
  drawTombstone,
  drawValuePair,
  positionMergedReplicas,
};
