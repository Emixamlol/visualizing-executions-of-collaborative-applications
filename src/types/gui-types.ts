import { Data } from './d3-framework-types';
import { ID } from './proxy-types';

export type updateButtons = Array<{ fn: string; args: boolean }>;

/** ---------------------------------------------------------------------------------------------------------------------
 *
 * Reusable GUI Components
 *
 *
 * The following interfaces define the API's for reusable GUI components
 *
 */
interface GuiReusableInterface<T> {
  (selection: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>): void;
}

export interface ReusableMenu extends GuiReusableInterface<ReusableMenu> {
  id(): string;
  id(value: string): ReusableMenu;

  labelText(): string;
  labelText(value: string): ReusableMenu;

  filterReplicas(): (data: Data) => Array<{ id: ID }>;
  filterReplicas(value: (data: Data) => Array<{ id: ID }>): ReusableMenu;

  currentSelection(): string;
  currentSelection(value: string): ReusableMenu;

  data(): Data;
  data(value: Data): ReusableMenu;

  on(...args): ReusableMenu;
  on(...args): any;
}

export interface ReusableButton extends GuiReusableInterface<ReusableButton> {
  methods(): updateButtons;
  methods(value: updateButtons): ReusableButton;

  on(...args): ReusableButton;
  on(...args): any;
}
