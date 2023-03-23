import * as d3 from 'd3';
import { ReusableButton, updateButtons } from '../../types/gui-types';

export const updateButton = (): ReusableButton => {
  let id: string;
  let methods: updateButtons;

  const listeners = d3.dispatch('click');

  const my: ReusableButton = (
    selection: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
  ) => {
    const htmlClass = 'crdt-update-methods';

    console.log('update buttons are =');
    console.log(methods);

    const form = selection
      .selectAll(`form.${htmlClass}`)
      .data([null])
      .join('form')
      .attr('class', htmlClass);

    const divs = form
      .selectAll(`div.${htmlClass}`)
      .data(methods)
      .join((enter) => enter.append('div').attr('class', htmlClass));

    const buttons = divs
      .selectAll(`button.${htmlClass}`)
      .data(({ fn, args }) => [{ fn, args }])
      .join('button')
      .attr('class', htmlClass)
      .attr('value', (d) => d.fn)
      .attr('type', 'button')
      .text((d) => d.fn)
      .on('click', (event, { fn }) => {
        const input = inputs
          .filter((d) => d.fn === fn)
          .node() as HTMLInputElement;

        const params: string[] = input
          ? input.value.split(/\s|\(|\)|,|\[|\]|=/i).filter((el) => el !== '')
          : [];

        if (input) input.value = '';

        listeners.call('click', null, [fn, params]);
      });

    const inputs = divs
      .filter((d) => d.args)
      .selectAll(`input.${htmlClass}`)
      .data(({ fn, args }) => [{ fn, args }])
      .join('input')
      .attr('class', htmlClass)
      .attr('type', 'text')
      .attr('id', (d) => d.fn);

    // remove labels that were there before
    divs
      .filter((d) => !d.args)
      .selectAll(`input.${htmlClass}`)
      .remove();
  };

  my.methods = function (_?: updateButtons): any {
    return arguments.length ? ((methods = _), my) : methods;
  };

  my.on = function () {
    const value = listeners.on.apply(listeners, arguments);
    return value === listeners ? my : value;
  };

  return my;
};
