import * as d3 from 'd3';
import { Data } from '../../types/d3-framework-types';
import { ReusableMenu } from '../../types/gui-types';
import { ID } from '../../types/proxy-types';
import { getAllReplicas } from '../data-processing';

export const menu = (): ReusableMenu => {
  let id: string;
  let labelText: string;
  let data: Data;
  let filterReplicas: (data: Data) => Array<{ id: ID }>;
  let currentSelection: string;

  const listeners = d3.dispatch('change');

  const my: ReusableMenu = (
    selection: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
  ) => {
    // process data
    const replicas = filterReplicas(data);

    // visualization
    const htmlClass = 'replica-selection';

    selection
      .selectAll(`label.${htmlClass}`)
      .data([null])
      .join('label')
      .attr('class', htmlClass)
      .attr('for', id)
      .text(labelText);

    selection
      .selectAll(`select.${htmlClass}`)
      .data([null])
      .join('select')
      .attr('class', htmlClass)
      .attr('id', id)
      .on('change', (event) => {
        currentSelection = event.target.value;

        listeners.call('change', null, currentSelection);
      })
      .selectAll('option')
      .data(replicas)
      .join('option')
      .attr('value', (d) => d.id)
      .text((d) => d.id);

    currentSelection = selection
      .selectAll(`select.${htmlClass}`)
      .property('value');
  };

  my.id = function (_?: string): any {
    return arguments.length ? ((id = _), my) : id;
  };

  my.labelText = function (_?: string): any {
    return arguments.length ? ((labelText = _), my) : labelText;
  };

  my.data = function (_?: Data): any {
    return arguments.length ? ((data = _), my) : data;
  };

  my.filterReplicas = function (_?: (data: Data) => Array<{ id: ID }>): any {
    return arguments.length ? ((filterReplicas = _), my) : filterReplicas;
  };

  my.currentSelection = function (_?: string): any {
    return arguments.length ? ((currentSelection = _), my) : currentSelection;
  };

  my.on = function (): any {
    const value = listeners.on.apply(listeners, arguments);
    return value === listeners ? my : value;
  };

  return my;
};
