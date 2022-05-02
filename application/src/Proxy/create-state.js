export const createState = (crdt, params) => {
  // create the object to be returned
  const state = {
    history: [], // history of the payload
    payload: [], // current payload
    color: colorGenerator.next().value, // color of crdt representation
  };

  switch (crdt) {
    case 'counter': {
      state.leftWrapper = ''; // defines how the displayed payload is wrapped from the left
      state.rightWrapper = ''; // defines how the displayed payload is wrapped from the right
      break;
    }

    case 'register': {
      state.leftWrapper = '('; // defines how the displayed payload is wrapped from the left
      state.rightWrapper = ')'; // defines how the displayed payload is wrapped from the right
      break;
    }

    case 'set': {
      state.leftWrapper = '{'; // defines how the displayed payload is wrapped from the left
      state.rightWrapper = '}'; // defines how the displayed payload is wrapped from the right
      break;
    }

    default:
      throw new Error('this CRDT does not exist');
  }

  return state; // return the state object
};

// color generator
function* ColorGenerator() {
  const colors = ['DarkMagenta', 'blue', 'brown', 'DarkGoldenRod', 'green'];

  let i = 0;
  while (true) {
    yield colors[i];
    i = i < colors.length - 2 ? i + 1 : 0;
  }
}

export const colorGenerator = ColorGenerator();
