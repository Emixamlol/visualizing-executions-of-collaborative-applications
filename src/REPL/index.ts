import * as d3 from 'd3';
import { execute } from './execute';
import { read } from './read';

// select the first div of the #repl div
const div: d3.Selection<HTMLDivElement, {}, HTMLElement, {}> = d3.select(
  '#repl .repl-element'
);

// add a form to div
const form: d3.Selection<HTMLFormElement, {}, HTMLDivElement, {}> = d3
  .select(div.node())
  .append('form');

// handle what has to happen when the user submits the code
const handleSubmit = (e: KeyboardEvent): void => {
  e.preventDefault();
  const code = textarea.node().value;
  try {
    execute(read(code));
  } catch (e) {
    console.warn(e.message);
  } finally {
    textarea.property('value', '');
  }
};

form.on('submit', handleSubmit);

// add a textarea to the form, this is where the user input will be written and executed
export const textarea: d3.Selection<
  HTMLTextAreaElement,
  {},
  HTMLFormElement,
  {}
> = d3.select(form.node()).append('textarea');

// handle what has to happen when a or multiple keys are pressed
const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key == 'Enter' && e.ctrlKey) handleSubmit(e);
};

// handle what has to happen when a key is released
const handleKeyUp = (e: KeyboardEvent): void => {
  textarea.style('height', 'auto');
  const scHeight = (e.target as HTMLTextAreaElement).scrollHeight;
  textarea.style('height', `${scHeight}px`);
};

textarea
  .attr('placeholder', 'add, remove or manipulate existing CRDTs')
  .on('keydown', handleKeyDown)
  .on('keyup', handleKeyUp);
