// process the entire data into different sets of data needed for the d3 api
import {
  Data,
  margin,
  stateCoordinates,
  lineCoordinates,
  symbolCoordinates,
  circleCoordinates,
  timelineCoordinates,
} from '../types/d3-framework-types';
import { Message, StateInterface } from '../types/proxy-types';

/**
 * Calculate the y position a new conceptual CRDT object's visualization starts at.
 *
 * @param data    The information about every conceptual CRDT object with their respective replicas
 * @param margin  The top - right - bottom - left margin values
 *
 * @returns An array containing the Y-axis position for every conceptual CRDT object, from which every respective replica will relatively be positioned to
 */
export const getStartYs = (data: Data, margin: margin): Array<number> =>
  data
    .reduce(
      (accumulator: Array<{ ry: number; startY: number }>, [, replicas]) => {
        const len = accumulator.length;
        const ry = replicas.length * 50;
        const startY =
          margin.top +
          (len ? accumulator[len - 1].startY + 2 * accumulator[len - 1].ry : 0);
        return accumulator.concat({ ry, startY });
      },
      []
    )
    .map(({ startY }) => startY);

/**
 * Get all the merges which took place between the replicas of one conceptual CRDT object.
 *
 * @param data  The information about every conceptual CRDT object with their respective replicas
 * @param index Position of the conceptual CRDT object in the data
 *
 * @returns The copy of an array with the merge information for all the replicas of the conceptual CRDT object specified by the index
 */
export const getMerges = (
  data: Data,
  index: number
): Array<StateInterface['merges']> => {
  const [, replicas] = data[index];
  return replicas.map(({ state }) => state.merges.slice());
};

/**
 * Get the state history (local updates + merges) for all replicas of one conceptual CRDT object.
 *
 * @param data  The information about every conceptual CRDT object with their respective replicas
 * @param index Position of the conceptual CRDT object in the data
 *
 * @returns The copy of an array with the history information for all the replicas of the conceptual CRDT object specified by the index
 */
export const getHistories = (
  data: Data,
  index: number
): Array<StateInterface['history']> => {
  const [, replicas] = data[index];
  return replicas.map(({ state }) => state.history.slice());
};

/**
 * Get the (x, y) coordinates for visualizing the replicas' states of one conceptual CRDT object, without differentiating between locally updated states and states which resulted from a merge with another replica.
 *
 * @param data    The information about every conceptual CRDT object with their respective replicas
 * @param index   Position of the conceptual CRDT object in the data
 * @param startY  The Y-axis position the replicas of the conceptual CRDT are relatively positioned to
 * @param margin  The top - right - bottom - left margin values
 *
 * @returns An array with the (x, y) coordinates, id and payload - computed for every state, of every replica, of the conceptual CRDT object specified by the index
 */
export const getStateCoordinates = (
  data: Data,
  index: number,
  startY: number,
  margin: margin
): stateCoordinates => {
  // get information which will be necessary to compute the coordinates
  const [, replicas] = data[index];
  const merges = getMerges(data, index);
  const histories = getHistories(data, index);

  // instantiate the array which will be returned
  const stateCoordinates: stateCoordinates = replicas.map(({ id }) => ({
    replicaId: id,
    coordinates: [],
  }));

  // fill the coordinates for the first state of every replica
  histories.forEach((history, i) => {
    const { msg, payload } = history.shift(); // take the first state which is the initialization of the replica (never empty)
    stateCoordinates[i].coordinates = stateCoordinates[i].coordinates.concat({
      cx: margin.left * 9,
      cy: startY + margin.top + 25 + 100 * i,
      title: `operation = ${msg},
      \npayload = ${payload[0]}, 
      \ntimestamp = ${JSON.stringify(payload[1])}`,
    });
  });

  // as long as there remain state updates in the histories array, continue to map them to the correct coordinates
  while (!histories.every((history) => !history.length)) {
    histories.forEach((history, i) => {
      if (history.length) {
        const { msg, payload } = history.shift();

        if (msg === Message.update) {
          // the state resulted from a local update on the replica
          const { coordinates } = stateCoordinates[i];
          const { cx, cy } = coordinates[coordinates.length - 1];
          stateCoordinates[i].coordinates = coordinates.concat({
            cx: cx + 125,
            cy,
            title: `operation = ${msg},
            \npayload = ${payload[0]},
            \ntimestamp = ${JSON.stringify(payload[1])}`,
          });
        } else {
          // the state resulted from a merge with another replica
          const { from, to } = merges[i].shift();
          const { other_id, history_index } = from;
          const { coordinates: fromCoordinates } = stateCoordinates.find(
            ({ replicaId }) => replicaId === other_id
          );
          if (history_index > fromCoordinates.length - 1) {
            // if the coordinates of the state, from which the replica was merged, have not been computed yet: don't do anything
            merges[i].unshift({ from, to });
            history.unshift({ msg, payload });
          } else {
            const { cx: x_from } = fromCoordinates[history_index];
            const { coordinates: toCoordinates } = stateCoordinates[i];
            const { cx, cy } = toCoordinates[toCoordinates.length - 1];

            // add the coordinates for the state resulting from the merge operation
            stateCoordinates[i].coordinates = toCoordinates.concat({
              cx: Math.max(cx, x_from) + 125,
              cy,
              title: `operation = ${msg},
              \npayload = ${payload[0]},
              \ntimestamp = ${JSON.stringify(payload[1])}`,
            });
          }
        }
      }
    });
  }

  return stateCoordinates;
};

/**
 * Get the (x1, y1, x2, y2) line coordinates for visualizing merge messages.
 *
 * @param data    The information about every conceptual CRDT object with their respective replicas
 * @param startYs The array containing the Y-axis position for every conceptual CRDT object, from which the respective replicas are relatively positioned to
 * @param margin  The top - right - bottom - left margin values
 *
 * @returns The array with (x1, y1, x2, y2) line coordinates representing all the different merges which have happened between the replicas of every respective conceptual CRDT object
 */
export const getLineCoordinates = (
  data: Data,
  startYs: Array<number>,
  margin: margin
): lineCoordinates => {
  const lineCoordinates: lineCoordinates = [];

  data.forEach((d, dataIndex) => {
    const stateCoordinates = getStateCoordinates(
      data,
      dataIndex,
      startYs[dataIndex],
      margin
    );
    const merges = getMerges(data, dataIndex);

    merges.forEach((replica, mergeIndex) => {
      replica.forEach(({ from, to }) => {
        // find {x_from, y_from}
        const { other_id, history_index } = from;
        const { coordinates: fromCoordinates } = stateCoordinates.find(
          ({ replicaId }) => replicaId === other_id
        );
        const { cx: x_from, cy: y_from } = fromCoordinates[history_index];

        // find {x_to, y_to}
        const { replicaId, coordinates } = stateCoordinates[mergeIndex];
        const { cx: x_to, cy: y_to, title } = coordinates[to];

        // add to lineCoordinates
        lineCoordinates.push({
          x_1: x_from,
          y_1: y_from,
          x_2: x_to,
          y_2: y_to,
          replicaId,
          title,
        });
      });
    });
  });

  return lineCoordinates;
};

/**
 * Get the (x, y) symbol coordinates for visualizing merged states.
 *
 * @param data    The information about every conceptual CRDT object with their respective replicas
 * @param startYs The array containing the Y-axis position for every conceptual CRDT object, from which the respective replicas are relatively positioned to
 * @param margin  The top - right - bottom - left margin values
 *
 * @returns The array with (x, y) coordinates for visualizing the states which resulted from a merge
 */
export const getSymbolCoordinates = (
  data: Data,
  startYs: Array<number>,
  margin: margin
): symbolCoordinates =>
  getLineCoordinates(data, startYs, margin).map(
    ({ x_2, y_2, replicaId, title }) => ({
      x: x_2,
      y: y_2,
      replicaId,
      title,
    })
  );

// method to
/**
 * Get the (x, y) circle coordinates for visualizing states resulting from local replica updates.
 *
 * @param data    The information about every conceptual CRDT object with their respective replicas
 * @param startYs The array containing the Y-axis position for every conceptual CRDT object, from which the respective replicas are relatively positioned to
 * @param margin  The top - right - bottom - left margin values
 *
 * @returns The array with (x, y) coordinates for visualizing the states which resulted from a local update
 */
export const getCircleCoordinates = (
  data: Data,
  startYs: Array<number>,
  margin: margin
): circleCoordinates => {
  const circlecoordinates: Array<circleCoordinates> = [];

  data.forEach((d, dataIndex) => {
    const stateCoordinates = getStateCoordinates(
      data,
      dataIndex,
      startYs[dataIndex],
      margin
    );
    const merges = getMerges(data, dataIndex);

    // filter stateCoordinates for every merge
    stateCoordinates.forEach(({ coordinates }, stateIndex) => {
      merges[stateIndex].forEach(({ to }, i) => {
        coordinates.splice(to - i, 1);
      });
    });

    // return adjusted stateCoordinates
    circlecoordinates.push(
      stateCoordinates
        .map(({ replicaId, coordinates }) =>
          coordinates.map((d) => ({ replicaId, ...d }))
        )
        .flat()
    );
  });
  return circlecoordinates.flat();
};

/**
 *
 * @param data    The information about every conceptual CRDT object with their respective replicas
 * @param startYs The array containing the Y-axis position for every conceptual CRDT object, from which the respective replicas are relatively positioned to
 * @param margin  The top - right - bottom - left margin values
 *
 * @returns The array with (x, y) coordinates for visualizing the timelines
 */
export const getTimelineCoordinates = (
  data: Data,
  startYs: Array<number>,
  margin: margin
): timelineCoordinates => {
  const timelineCoordinates: timelineCoordinates = [];

  data.forEach((d, dataIndex) => {
    const stateCoordinates = getStateCoordinates(
      data,
      dataIndex,
      startYs[dataIndex],
      margin
    );
    stateCoordinates.forEach(({ replicaId, coordinates }) => {
      const { cx, cy } = coordinates[coordinates.length - 1];
      timelineCoordinates.push({ id: replicaId, y: cy, lineLength: cx });
    });
  });

  return timelineCoordinates;
};
