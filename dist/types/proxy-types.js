// State
// ------------------------------------------------------------------------------
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
