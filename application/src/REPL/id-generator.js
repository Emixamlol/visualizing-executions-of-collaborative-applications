// https://www.youtube.com/watch?v=IJ6EgdiI_wU

// Generator used to generate unique ids (temporary - does not create unique ids in a distributed system)

function* generateId() {
  let id = 1;

  while (true) {
    yield id;
    id++;
  }
}

export const IdGenerator = generateId();
