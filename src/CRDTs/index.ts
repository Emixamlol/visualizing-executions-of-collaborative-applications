// import this file to import every CRDT

import TwoPhase_Set from './2P-Set/set';
import LWW_Register from './LWW-Register/register';
import PN_Counter from './PN-Counter/counter';
import LWW_Flag from './Base-CRDTs/flag';
import Inc_Counter from './Base-CRDTs/inc-counter';

export { TwoPhase_Set, LWW_Register, PN_Counter, Inc_Counter, LWW_Flag };
