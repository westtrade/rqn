"use strict";
exports.__esModule = true;
require('ts-node').register({
/* options */
});
var Injector_1 = require("./src/Injector");
function rqn(inputPath, config) {
    if (config === void 0) { config = {}; }
    config = config || {};
    var pathList = (Array.isArray(inputPath) && inputPath.slice(0)) || [
        inputPath,
    ];
    var injector = new Injector_1["default"](inputPath, config);
    return injector.run.bind(injector);
}
exports["default"] = rqn;
