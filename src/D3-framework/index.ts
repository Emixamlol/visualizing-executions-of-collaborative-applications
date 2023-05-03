// main d3 framework file, it defines the api for the library
import { Data } from '../types/d3-framework-types';
import { update as mainSvgUpdate } from './Svg/main-svg';
import {
  update as specificSvgUpdate,
  drawFlag,
  drawSingleValue,
  drawCounter,
  drawRegister,
  drawSet,
  drawTombstone,
} from './Svg/specific-svg';

const update = (data: Data) => {
  mainSvgUpdate(data);
  specificSvgUpdate(data);
};

export {
  update,
  drawCounter,
  drawFlag,
  drawRegister,
  drawSet,
  drawTombstone,
  drawSingleValue,
};
