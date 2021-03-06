export var Keyword;
(function (Keyword) {
    Keyword["const"] = "const";
    Keyword["delete"] = "delete";
    Keyword["replicate"] = "replicate";
})(Keyword || (Keyword = {}));
// State
function* ColorGenerator() {
    const colors = ['DarkMagenta', 'blue', 'brown', 'DarkGoldenRod', 'green'];
    let i = 0;
    while (true) {
        yield colors[i];
        i = i < colors.length - 2 ? i + 1 : 0;
    }
}
export const colorGenerator = ColorGenerator();
// Proxy
export var ProxyMethod;
(function (ProxyMethod) {
    ProxyMethod["new"] = "new";
    ProxyMethod["delete"] = "delete";
    ProxyMethod["replicate"] = "replicate";
    ProxyMethod["merge"] = "merge";
    ProxyMethod["apply"] = "apply";
})(ProxyMethod || (ProxyMethod = {}));
