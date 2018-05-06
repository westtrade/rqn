"use strict";
exports.__esModule = true;
var _1 = require("../");
var dotenv = require("dotenv");
dotenv.config();
var config = {
    components: {
        db: {
            connect: 'mongodb://172.21.0.2/test'
        }
    },
    root: __dirname
};
var injector = _1["default"](['./components/common', './components/controllers', './components/models'], config);
exports["default"] = injector;
