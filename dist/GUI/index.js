import * as d3 from 'd3';
import { applyToProxy } from '../Proxy';
import { menu } from './Reusable-blocks/menu';
import { updateButton } from './Reusable-blocks/update-button';
// constants
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const guiContainer = d3
    .select('#repl')
    .append('div')
    .attr('class', 'gui-container repl-element');
// div containing the menu to select the replica
const allReplicasMenu = guiContainer.append('div');
// div containing the update methods which can be applied to the selected replica
const updateMethods = guiContainer.append('div');
const counterButtons = [
    { fn: 'increment', args: true },
    { fn: 'decrement', args: false },
];
const data = [];
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
export const update = (data) => {
    allReplicasMenu.call(replicaMenu.data(data));
    updateMethods.call(buttons.data(data));
};
