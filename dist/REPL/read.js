import { Keyword } from '../types';
export const read = (code) => {
    const toParse = `toParse: ${code}`;
    console.log(toParse);
    const parsed = code.split(/\s|\(|\)|,|\[|\]|=/i).filter((el) => el !== ''); // transforms the string of code into an array of tokens
    const keyword = parsed.shift(); // get the first word of the parsed code
    let [proc, parameters] = ['', ['']];
    switch (keyword) {
        case Keyword.const:
            proc = parsed.splice(1, 1)[0];
            parameters = parsed;
            break;
        case Keyword.delete:
        case Keyword.replicate:
            proc = keyword;
            parameters = parsed;
            break;
        default: // in this case the first word was a variable name; the next word is then the keyword
            const fn = parsed.shift();
            if (!['query', 'merge', 'compare', 'apply'].includes(fn))
                throw new Error('cannot read invalid code');
            proc = fn;
            parameters = [keyword, ...parsed];
    }
    console.log(`reading: proc = ${proc}, parameters = ${parameters}`);
    return { proc, parameters };
};
