// State
// ------------------------------------------------------------------------------
function* ColorGenerator() {
    const colors = ['DarkMagenta', 'blue', 'brown', 'DarkGoldenRod', 'green'];
    let i = 0;
    while (true) {
        yield colors[i];
        i = i < colors.length - 2 ? i + 1 : 0;
    }
}
export const colorGenerator = ColorGenerator();
export var Message;
(function (Message) {
    Message["initialized"] = "initialized";
    Message["update"] = "update";
    Message["merge"] = "merge";
})(Message || (Message = {}));
export var ProxyMethod;
(function (ProxyMethod) {
    ProxyMethod["new"] = "new";
    ProxyMethod["query"] = "query";
    ProxyMethod["delete"] = "delete";
    ProxyMethod["replicate"] = "replicate";
    ProxyMethod["merge"] = "merge";
    ProxyMethod["apply"] = "apply";
})(ProxyMethod || (ProxyMethod = {}));
// ------------------------------------------------------------------------------
