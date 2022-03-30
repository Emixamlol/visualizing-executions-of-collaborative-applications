export const read = (code) => {
  const toParse = `toParse: ${code}`; // code to be parsed
  console.log(toParse);

  const parsed = code.split(/\s|\(|\)|,|\[|\]|=/i).filter((el) => el !== ''); // transforms the string of code into an array of tokens
  const keyword = parsed.shift(); // get the first word of the parsed code
  console.log(parsed);

  let [proc, parameters] = ['', ''];

  switch (keyword) {
    case 'const':
      proc = parsed.splice(1, 1)[0];
      parameters = parsed;
      break;

    case 'delete':
      proc = keyword;
      parameters = parsed;
      break;

    default:
      if (parsed.shift() !== 'apply')
        throw new Error('cannot read invalid code');

      proc = parsed.shift();
      parameters = [keyword, ...parsed];
  }

  console.log(`reading: proc = ${proc}, parameters = ${parameters}`);

  return { proc, parameters };
};
