import * as d3 from 'd3';

import {
  basicParameters,
  Data,
  ReusableComponents,
  ReusableLabel,
} from '../../types/d3-framework-types';
import { ID } from '../../types/proxy-types';
import { getStartYs } from '../data-processing';
import { flag } from '../Reusable-blocks/library/flag';
import { label } from '../Reusable-blocks/library/label';
import { mergeArrows } from '../Reusable-blocks/library/merge';
import { set } from '../Reusable-blocks/library/set';
import { timestamp as reusableTimestamp } from '../Reusable-blocks/library/timestamp';
import { tombstone } from '../Reusable-blocks/library/tombstone';
import { valuePair } from '../Reusable-blocks/library/value-pair';
import { componentHandling } from '../specific-information';

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

// TODO: refactor to work around groupElements map

/**
 * map of id to group elements. The latter contains the svg elements drawing the replica with that id
 */
const groupElements: Map<
  ID,
  d3.Selection<SVGGElement, unknown, HTMLElement, any>
> = new Map();

// TODO : refactor so that composition is possible

/**
 * map of replicas who are currently being visualized in the specific-svg, mapped to the Map of sub-elements visualizing them
 */
const activeVisualizations: Map<
  ID,
  Map<string, ReusableComponents>
> = new Map();

const refactorMap: Map<ID, componentHandling> = new Map();

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

// ------------------------- update methods -------------------------

// update objectId
const sendObjectId = (id: ID): void => {
  console.log(`objectId = ${objecId}, sent id = ${id}`);
  if (objecId !== id) {
    console.log(
      `removing all elements (except merge group) in specific visualization`
    );
    svg.selectChildren('*').filter(':not(g.merge)').remove();
    mergeG.selectChildren('*').remove();
    groupElements.clear();
    activeVisualizations.clear();
  }
  objecId = id;
};

// update replicaId
const sendReplicaId = (id: ID): void => {
  replicaId = id;
  if (!groupElements.has(id)) {
    const g = svg.append('g').attr('class', id);
    groupElements.set(id, g);
  }
  if (!refactorMap.has(id)) {
    const g = svg.append('g').attr('class', id);
    const handler = new componentHandling(g);
    refactorMap.set(id, handler);
  }
  mergeG.selectChildren('*').remove();
};

// update the data sent by the proxies
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

// add newly created visualization components for a replica to the map
const updateVisualizations = (
  label: string,
  components: ReusableComponents
): void => {
  const subComponents = activeVisualizations.get(replicaId);

  const id = label === undefined ? replicaId : label;

  const allComponents =
    subComponents === undefined
      ? new Map([[id, components]])
      : subComponents.set(id, components);

  activeVisualizations.set(replicaId, allComponents);
  console.log(activeVisualizations, 'activeVisualizations');
};

const remove = (id: ID): void => {
  svg.selectAll(`g.${id}`).remove();
  groupElements.delete(id);
  activeVisualizations.delete(id);
};

const yValue = (replicaId: ID): number => {
  const index = replicaId ? replicas.findIndex((id) => id === replicaId) : 0;
  return startHeights.at(index);
};

// ------------------------- draw methods -------------------------

// ----- help methods -----
const newLabel = (caption: string): ReusableLabel => {
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

const drawMergedReplica = (components: ReusableComponents): void => {
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

const positionMergedReplicas = (senderId: ID, receiverId: ID): void => {
  console.log(
    `positioning merged replicas with senderId = ${senderId}; receiverId = ${receiverId}`
  );

  merge = true;
  const addX = 400;
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
  });
};

/* const drawReplicas = (): void => {
  // draw the currently active replicas
  activeVisualizations.forEach((map, replicaId) => {
    const g = groupElements.get(replicaId);
    map.forEach((components, key) => {
      components.forEach((component) => {
        const props = Object.getOwnPropertyNames(component);
        component
          .x(props.includes('caption') ? labelX : baseX)
          .y(yValue(replicaId))
          .replicaId(key);
        g.call(component);
      });
    });
  });
}; */
const drawReplicas = (): void => {
  // draw the currently active replicas
  refactorMap.forEach((handler, label) => {
    handler.drawAllComponents();
  });
};

// ----- component methods -----
const drawFlag = (params: basicParameters, enabled: boolean): void => {
  const { label, x, y, color } = params;

  const Label = newLabel(label);

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

  updateVisualizations(label, components);

  if (merge) {
    drawMergedReplica(components);
  } else {
    drawReplicas();
  }
};

const drawCounter = (
  params: basicParameters,
  value: number,
  P: Array<number>
): void => {
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

  updateVisualizations(label, components);
  refactorMap
    .get(replicaId)
    .addComponents(components, {
      ...params,
      x: baseX + x,
      y: yValue(replicaId) + y,
    });

  if (merge) {
    drawMergedReplica(components);
  } else {
    drawReplicas();
  }
};

const drawRegister = (
  params: basicParameters,
  value: string,
  timestamp: Array<number>
): void => {
  const { label, x, y, color } = params;

  const Label = newLabel(label);

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

  const components = [Label, Set];

  updateVisualizations(label, components);

  if (merge) {
    drawMergedReplica(components);
  } else {
    drawReplicas();
  }
};

const drawSet = (
  params: basicParameters,
  elements: Array<string>,
  tombstone?: Array<string>
): void => {
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

  updateVisualizations(label, components);

  if (merge) {
    drawMergedReplica(components);
  } else {
    drawReplicas();
  }
};

const drawTombstone = (params: basicParameters): void => {
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

  updateVisualizations(label, components);

  if (merge) {
    drawMergedReplica(components);
  } else {
    drawReplicas();
  }
};

const drawValuePair = (params: basicParameters): void => {};

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
