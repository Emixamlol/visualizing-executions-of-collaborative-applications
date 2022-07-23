import * as d3 from 'd3';
export const drawBasicState = () => {
    let width;
    let height;
    let margin;
    let data = [];
    let radius;
    const my = (selection) => {
        // set scales
        const x = margin.left * 9;
        const xScale = d3
            .scaleLinear()
            .domain([0, history.length])
            .range([x, x + history.length * 125]);
        const replicas = data
            .map(([id, replicas]) => replicas.map((replica) => replica.id))
            .flat();
        const colorScale = d3
            .scaleOrdinal()
            .domain(replicas)
            .range(d3.schemePaired);
        const t = d3.transition().duration(1000);
        // process data
        // calculate the y position a new crdt object starts at
        const getStartYs = () => data
            .reduce((accumulator, [, replicas]) => {
            const len = accumulator.length;
            const ry = replicas.length * 50;
            const startY = margin.top +
                (len
                    ? accumulator[len - 1].startY + 2 * accumulator[len - 1].ry
                    : 0);
            return accumulator.concat({ ry, startY });
        }, [])
            .map(({ startY }) => startY);
        const startYs = getStartYs();
        console.log('startYs in basic-state');
        console.log(startYs);
        // method to get all the merges which took place between the replicas of one conceptual CRDT object
        const getMerges = (data, index) => {
            const [, replicas] = data[index];
            return replicas.map(({ state }) => state.merges);
        };
        const correctCoordinates = (rawCoordinates, index) => {
            const merges = getMerges(data, index);
            merges.forEach((replica, mergeIndex) => {
                replica.forEach(({ from, to }) => {
                    // find {x_from, y_from}
                    const { other_id, history_index } = from;
                    const fromCoordinates = rawCoordinates.find(({ replicaId }) => replicaId === other_id);
                    const { cx: x_from, cy: y_from } = fromCoordinates.coordinates[history_index];
                    // find {x_to, y_to}
                    const { replicaId, coordinates } = rawCoordinates[mergeIndex];
                    const { cx: x_to, cy: y_to, title } = coordinates[to];
                    // correct coordinates
                    if (history_index >= to && x_to <= x_from) {
                        const { replicaId, coordinates } = rawCoordinates[mergeIndex];
                        rawCoordinates.splice(mergeIndex, 1, {
                            replicaId,
                            coordinates: coordinates.map(({ cx, cy, title }, i) => ({
                                cx: i >= to ? x_from + 125 * i : cx,
                                cy,
                                title,
                            })),
                        });
                    }
                });
            });
            return rawCoordinates;
        };
        /**
         * Get the (x, y) coordinates for visualizing the replicas' states of one conceptual CRDT object, without differentiating between locally updated states and states which resulted from a merge with another replica
         *
         * @param data  The information about every conceptual CRDT object with their respective replicas
         * @param index Position of the conceptual CRDT object
         *
         * @returns An array with the (x, y) coordinates, id and payload - computed for every state, of every replica, of the conceptual CRDT object specified by the index
         */
        const getStateCoordinates = (data, index) => {
            const [, replicas] = data[index];
            const rawCoordinates = replicas.map(({ id, state }, replicaIndex) => {
                const startY = startYs[index];
                const coordinates = state.history.map(({ msg, payload }, historyIndex) => ({
                    cx: xScale(historyIndex),
                    cy: startY + margin.top + 25 + 100 * replicaIndex,
                    title: `operation = ${msg},
             \npayload = ${payload[0]}, 
             \ntimestamp = ${JSON.stringify(payload[1])}`,
                }));
                return {
                    replicaId: id,
                    coordinates,
                };
            });
            return correctCoordinates(rawCoordinates, index);
        };
        // method to get the (x1, y1, x2, y2) line coordinates for visualizing merge messages
        const getLineCoordinates = (data) => {
            const lineCoordinates = [];
            data.forEach((d, dataIndex) => {
                const stateCoordinates = getStateCoordinates(data, dataIndex);
                const merges = getMerges(data, dataIndex);
                merges.forEach((replica, mergeIndex) => {
                    replica.forEach(({ from, to }) => {
                        // find {x_from, y_from}
                        const { other_id, history_index } = from;
                        const fromCoordinates = stateCoordinates.find(({ replicaId }) => replicaId === other_id);
                        const { cx: x_from, cy: y_from } = fromCoordinates.coordinates[history_index];
                        // find {x_to, y_to}
                        const { replicaId, coordinates } = stateCoordinates[mergeIndex];
                        const { cx: x_to, cy: y_to, title } = coordinates[to];
                        // add to lineCoordinates by adjusting x_to, to ensure x_to > x_from
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
        // method to get the (x, y) symbol coordinates for visualizing merged states
        const getSymbolCoordinates = (data) => {
            const lineCoordinates = getLineCoordinates(data);
            return lineCoordinates.map(({ x_2, y_2, replicaId, title }) => ({
                x: x_2,
                y: y_2,
                replicaId,
                title,
            }));
        };
        // method to get the (x, y) circle coordinates for visualizing states resulting from local replica updates
        const getCircleCoordinates = (data) => {
            const circlecoordinates = [];
            data.forEach((d, dataIndex) => {
                const stateCoordinates = getStateCoordinates(data, dataIndex);
                const merges = getMerges(data, dataIndex);
                // filter stateCoordinates for every merge
                stateCoordinates.forEach(({ coordinates }, stateIndex) => {
                    merges[stateIndex].forEach(({ to }) => {
                        const len = coordinates.length;
                        coordinates.splice(to, 1);
                        const updatedCoordinates = coordinates
                            .slice(to, len)
                            .map(({ cx, cy, title }) => ({ cx: cx + 125, cy, title }));
                        coordinates.splice(to, len - to, ...updatedCoordinates);
                    });
                });
                // return adjusted stateCoordinates
                circlecoordinates.push(stateCoordinates
                    .map(({ replicaId, coordinates }) => coordinates.map((d) => (Object.assign({ replicaId }, d))))
                    .flat());
            });
            return circlecoordinates.flat();
        };
        data.forEach((d, i) => {
            console.log(`state coordinates for index ${i}`);
            console.log(getStateCoordinates(data, i));
            console.log(`merges for index ${i}`);
            console.log(getMerges(data, i));
            console.log('line coordinates');
            console.log(getLineCoordinates(data));
            console.log('symbol coordinates');
            console.log(getSymbolCoordinates(data));
            console.log('circle coordinates');
            console.log(getCircleCoordinates(data));
        });
        const objects = data
            .reduce((accumulator, [, replicas]) => {
            return accumulator.concat([
                replicas
                    .map(({ id: replicaId, state }, i) => {
                    const length = accumulator.length;
                    const ry = replicas.length * 50;
                    const startY = margin.top +
                        (length
                            ? accumulator[length - 1][0].startY +
                                2 * accumulator[length - 1][0].ry
                            : 0);
                    const cy = startY + 25 + margin.top + 100 * i; // 25 is the radius, to be changed sensical variable name for timeline
                    const { history, merges } = state;
                    return history.map(({ msg, payload }, i) => ({
                        cx: xScale(i),
                        cy,
                        ry,
                        startY,
                        id: replicaId,
                        title: `operation = ${msg},
                 \npayload = ${payload[0]}, 
                 \ntimestamp = ${JSON.stringify(payload[1])}`,
                    }));
                })
                    .flat(),
            ]);
        }, [])
            .flat();
        console.log('objects in basic-state');
        console.log(objects);
        // visualization
        const htmlClass = 'basic-state';
        const g = selection
            .selectAll(`g.${htmlClass}`)
            .data([null])
            .join('g')
            .attr('class', htmlClass);
        g.selectAll('circle')
            .data(getCircleCoordinates(data))
            .join((enter) => enter
            .append('circle')
            .attr('cx', (d) => d.cx)
            .attr('cy', (d) => d.cy)
            .attr('r', 0)
            .call((enter) => enter
            .transition(t)
            .attr('r', radius)
            .attr('fill', (d) => colorScale(d.replicaId))
            .attr('stroke', (d) => colorScale(d.replicaId)))
            .append('title')
            .text((d) => d.title), (update) => update
            .attr('cx', (d) => d.cx)
            .attr('cy', (d) => d.cy)
            .attr('r', radius)
            .attr('fill', (d) => colorScale(d.replicaId))
            .attr('stroke', (d) => colorScale(d.replicaId))
            .select('title')
            .text((d) => d.title));
        g.selectAll('path')
            .data(getSymbolCoordinates(data))
            .join((enter) => enter
            .append('path')
            .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
            .attr('fill', 'white')
            .attr('d', d3.symbol(d3.symbolsFill[4], 150)())
            .call((enter) => enter
            .transition(t)
            .attr('fill', (d) => colorScale(d.replicaId))
            .attr('stroke', (d) => colorScale(d.replicaId)))
            .append('title')
            .text((d) => d.title), (update) => update
            .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
            .attr('fill', 'white')
            .attr('d', d3.symbol(d3.symbolsFill[4], 150)())
            .attr('fill', (d) => colorScale(d.replicaId))
            .attr('stroke', (d) => colorScale(d.replicaId))
            .select('title')
            .text((d) => d.title));
        g.selectAll('line')
            .data(getLineCoordinates(data))
            .join((enter) => enter
            .append('line')
            .attr('stroke', 'black')
            .attr('x1', (d) => d.x_1)
            .attr('y1', (d) => d.y_1)
            .attr('x2', (d) => d.x_1)
            .attr('y2', (d) => d.y_1)
            .transition(t)
            .attr('x2', (d) => d.x_2)
            .attr('y2', (d) => d.y_2), (update) => update
            .attr('x1', (d) => d.x_1)
            .attr('y1', (d) => d.y_1)
            .attr('x2', (d) => d.x_2)
            .attr('y2', (d) => d.y_2));
    };
    my.width = function (_) {
        return arguments.length ? ((width = _), my) : width;
    };
    my.height = function (_) {
        return arguments.length ? ((height = _), my) : height;
    };
    my.margin = function (_) {
        return arguments.length ? ((margin = _), my) : margin;
    };
    my.data = function (_) {
        return arguments.length ? ((data = _), my) : data;
    };
    my.radius = function (_) {
        return arguments.length ? ((radius = _), my) : radius;
    };
    return my;
};
