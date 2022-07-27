import * as d3 from 'd3';
import * as proxies from '../Proxy';
import { getAllReplicas, getMethods, getSiblingReplicas, } from './data-processing';
import { menu } from './Reusable-blocks/menu';
import { updateButton } from './Reusable-blocks/update-button';
// constants
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const guiContainer = d3
    .select('#repl')
    .append('div')
    .attr('class', 'gui-container repl-element');
// div containing the menu to select the replica
const allReplicasContainer = guiContainer.append('div');
// div containing the update methods which can be applied to the selected replica
const updateButtonsContainer = guiContainer.append('div');
// div containing the menu to select which replica to merge with
const siblingReplicasContainer = guiContainer.append('div');
const data = [];
const allReplicasMenu = menu()
    .id('all-replicas-menu')
    .labelText('replicas: ')
    .data(data)
    .filterReplicas(getAllReplicas)
    .on('change', (id) => {
    const type = proxies.getType(id);
    const methods = getMethods(type);
    updateButtonsContainer.call(updateButtons.methods(methods));
    siblingReplicasContainer.call(siblingReplicasMenu.filterReplicas((data) => getSiblingReplicas(data, id)));
});
const updateButtons = updateButton()
    .methods([])
    .on('click', ([fn, params]) => {
    const id = allReplicasMenu.currentSelection();
    proxies.applyToProxy(id, fn, params);
});
const siblingReplicasMenu = menu()
    .id('sibling-replicas-menu')
    .labelText('')
    .data(data)
    .filterReplicas((data) => {
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
export const update = (data) => {
    allReplicasContainer.call(allReplicasMenu.data(data));
    const id = allReplicasMenu.currentSelection();
    const type = proxies.getType(id);
    const methods = getMethods(type);
    updateButtonsContainer.call(updateButtons.methods(methods));
    siblingReplicasContainer.call(siblingReplicasMenu.data(data).filterReplicas((data) => {
        return getSiblingReplicas(data, id);
    }));
};
