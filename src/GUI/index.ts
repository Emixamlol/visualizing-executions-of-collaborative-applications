import * as d3 from 'd3';
import { applyToProxy } from '../Proxy';
import { Data, margin } from '../types/d3-framework-types';
import { updateButtons } from '../types/gui-types';
import { ID } from '../types/proxy-types';
import { menu } from './Reusable-blocks/menu';
import { updateButton } from './Reusable-blocks/update-button';

// constants
const margin: margin = { top: 20, right: 20, bottom: 20, left: 20 };

const guiContainer: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> = d3
  .select('#repl')
  .append('div')
  .attr('class', 'gui-container repl-element');

// div containing the menu to select the replica
const allReplicasMenu: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> =
  guiContainer.append('div');

// div containing the update methods which can be applied to the selected replica
const updateMethods: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> =
  guiContainer.append('div');

const counterButtons: updateButtons = [
  { fn: 'increment', args: true },
  { fn: 'decrement', args: false },
];

const data: Data = [];

const replicaMenu = menu()
  .id('all-replicas-menu')
  .labelText('replicas: ')
  .data(data);

const buttons = updateButton()
  .methods(counterButtons)
  .data(data)
  .on('click', ([fn, params]) => {
    const id = replicaMenu.currentSelection();
    console.log('onclick in GUI/index.ts');
    console.log(id);
    console.log(fn);
    console.log(params);

    applyToProxy(id, fn, params);
  });

allReplicasMenu.call(replicaMenu);

updateMethods.call(buttons);

export const update = (data: Data): void => {
  allReplicasMenu.call(replicaMenu.data(data));
  updateMethods.call(buttons.data(data));
};
