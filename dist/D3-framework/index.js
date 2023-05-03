import { update as mainSvgUpdate } from './Svg/main-svg';
import { update as specificSvgUpdate, drawFlag, drawSingleValue, drawCounter, drawRegister, drawSet, drawTombstone, } from './Svg/specific-svg';
const update = (data) => {
    mainSvgUpdate(data);
    specificSvgUpdate(data);
};
export { update, drawCounter, drawFlag, drawRegister, drawSet, drawTombstone, drawSingleValue, };
