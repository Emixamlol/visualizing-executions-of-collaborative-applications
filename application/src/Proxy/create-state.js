export const createState = (crdt, params) => {
  // create the object to be returned
  const state = {
    history: [],
  };

  switch (crdt) {
    case 'counter': {
      state.color = 'DarkGoldenRod';
      state.content = 0;
      state.leftWrapper = ''; // defines how the displayed content is wrapped from the left
      state.rightWrapper = ''; // defines how the displayed content is wrapped from the right
      break;
    }

    case 'register': {
      state.color = 'green';
      state.content = [0, 0];
      state.leftWrapper = '('; // defines how the displayed content is wrapped from the left
      state.rightWrapper = ')'; // defines how the displayed content is wrapped from the right
      break;
    }

    case 'set': {
      state.color = 'blue';
      state.content = [];
      state.leftWrapper = '{'; // defines how the displayed content is wrapped from the left
      state.rightWrapper = '}'; // defines how the displayed content is wrapped from the right
      break;
    }

    default:
      throw new Error('this CRDT does not exist');
  }

  return state; // return the state object
};
