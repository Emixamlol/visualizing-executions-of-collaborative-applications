// reference: https://stackoverflow.com/questions/11120840/hash-string-into-rgb-color
const djb2 = (str) => {
    let hash = 0; //5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
};
const StringToColor = (str) => {
    const hash = djb2(str);
    const r = (hash & 0xff0000) >> 16;
    const g = (hash & 0x00ff00) >> 8;
    const b = hash & 0x0000ff;
    return ('#' +
        ('0' + r.toString(16)).substring(-2) +
        ('0' + g.toString(16)).substring(-2) +
        ('0' + b.toString(16)).substring(-2));
};
export { StringToColor };
