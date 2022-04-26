export const createState = (crdt, params) => {
  // create the object to be returned
  const state = {
    history: [0], // history of the payload
  };

  switch (crdt) {
    case 'counter': {
      state.color = 'DarkGoldenRod';
      state.payload = [0];
      state.leftWrapper = ''; // defines how the displayed payload is wrapped from the left
      state.rightWrapper = ''; // defines how the displayed payload is wrapped from the right
      break;
    }

    case 'register': {
      state.color = 'green';
      state.payload = [0];
      state.leftWrapper = '('; // defines how the displayed payload is wrapped from the left
      state.rightWrapper = ')'; // defines how the displayed payload is wrapped from the right
      break;
    }

    case 'set': {
      state.color = 'blue';
      state.payload = [];
      state.leftWrapper = '{'; // defines how the displayed payload is wrapped from the left
      state.rightWrapper = '}'; // defines how the displayed payload is wrapped from the right
      break;
    }

    default:
      throw new Error('this CRDT does not exist');
  }

  return state; // return the state object
};
