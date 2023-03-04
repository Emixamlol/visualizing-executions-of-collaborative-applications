import * as d3 from 'd3';
import { sendObjectId, sendReplicaId } from '../D3-framework/Svg/specific-svg';
import * as proxies from '../Proxy';
import { Data, margin } from '../types/d3-framework-types';
import { updateButtons } from '../types/gui-types';
import { ID } from '../types/proxy-types';
import {
  getAllReplicas,
  getMethods,
  getSiblingReplicas,
} from './data-processing';
import { menu } from './Reusable-blocks/menu';
import { updateButton } from './Reusable-blocks/update-button';

// constants
const data: Data = [];
const margin: margin = { top: 20, right: 20, bottom: 20, left: 20 };

const guiContainer: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> = d3
  .select('#repl')
  .append('div')
  .attr('class', 'gui-container repl-element');

// div containing the menu to select the replica
const allReplicasContainer: d3.Selection<
  HTMLDivElement,
  unknown,
  HTMLElement,
  any
> = guiContainer.append('div').attr('class', 'grid-header');

// div containing the update methods which can be applied to the selected replica
const updateButtonsContainer: d3.Selection<
  HTMLDivElement,
  unknown,
  HTMLElement,
  any
> = guiContainer.append('div').attr('class', 'grid-buttons');

// div containing the menu to select which replica to merge with
const siblingReplicasContainer: d3.Selection<
  HTMLDivElement,
  unknown,
  HTMLElement,
  any
> = guiContainer.append('div').attr('class', 'grid-merge');

const allReplicasMenu = menu()
  .id('all-replicas-menu')
  .labelText('replicas: ')
  .data(data)
  .filterReplicas(getAllReplicas)
  .on('change', (id: ID) => {
    const objectId = proxies.getObjectId(id);
    const type = proxies.getType(id);
    const methods = getMethods(type);

    sendObjectId(objectId);
    sendReplicaId(id);
    proxies.visualizeCRDT(id);

    updateButtonsContainer.call(updateButtons.methods(methods));
    siblingReplicasContainer.call(
      siblingReplicasMenu.filterReplicas((data: Data) =>
        getSiblingReplicas(data, id)
      )
    );
  });

const updateButtons = updateButton()
  .methods([])
  .on('click', ([fn, params]) => {
    const id = allReplicasMenu.currentSelection();

    console.log(id);
    console.log(fn);
    console.log(params);

    proxies.applyToProxy(id, fn, params);
  });

const siblingReplicasMenu = menu()
  .id('sibling-replicas-menu')
  .labelText('')
  .data(data)
  .filterReplicas((data: Data) => {
    const id = allReplicasMenu.currentSelection();
    return getSiblingReplicas(data, id);
  });

const mergeButton = updateButton()
  .methods([{ fn: 'merge', args: false }])
  .on('click', ([fn, params]) => {
    const id = allReplicasMenu.currentSelection();
    const other = siblingReplicasMenu.currentSelection();

    proxies.mergeProxy(id, other);
  });

// initialize containers
allReplicasContainer.call(allReplicasMenu);
updateButtonsContainer.call(updateButtons);
siblingReplicasContainer.call(siblingReplicasMenu).call(mergeButton);

export const update = (data: Data): void => {
  allReplicasContainer.call(allReplicasMenu.data(data));
  const id = allReplicasMenu.currentSelection();
  const type = proxies.getType(id);
  const methods = getMethods(type);
  updateButtonsContainer.call(updateButtons.methods(methods));
  siblingReplicasContainer.call(
    siblingReplicasMenu.data(data).filterReplicas((data: Data) => {
      return getSiblingReplicas(data, id);
    })
  );
};
