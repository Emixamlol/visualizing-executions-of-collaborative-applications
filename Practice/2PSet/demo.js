import TwoPhase_Set from './set.js';

const set = new TwoPhase_Set();

set.add('a');
console.log(set.lookup('a'));

set.remove('a');
console.log(set.lookup('a'));

set.add('a');
console.log(set.lookup('a'));
