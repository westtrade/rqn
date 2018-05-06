"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var path_1 = require("path");
var props = Symbol('private propetries');
var ARGS_MATCHER = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var getArgs = function (src) {
    return src.match(ARGS_MATCHER)[1].split(', ');
};
var exists = function (path) {
    return new Promise(function (resolve) {
        return fs.stat(path, function (err, result) { return resolve(err ? false : path); });
    });
};
var Injector = /** @class */ (function () {
    function Injector(modules, config) {
        if (config === void 0) { config = {}; }
        this[props] = {
            resolvers: {
                config: config
            },
            modules: modules
        };
    }
    Object.defineProperty(Injector.prototype, "root", {
        get: function () {
            return path_1.resolve(this[props].resolvers.config.root || '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Injector.prototype, "pathList", {
        get: function () {
            return this[props].modules.slice(0);
        },
        enumerable: true,
        configurable: true
    });
    Injector.prototype.getModuleConfig = function (modName) {
        return this[props].resolvers.config.components[modName] || {};
    };
    Injector.prototype.findModule = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var stats, modPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stats = this.pathList
                            .reduce(function (result, path) {
                            return result.concat([
                                path_1.resolve(_this.root, path + "/" + name + ".ts"),
                                path_1.resolve(_this.root, path + "/" + name + "/index.ts"),
                            ]);
                        }, [])
                            .map(exists);
                        return [4 /*yield*/, Promise.all(stats)];
                    case 1:
                        modPath = (_a.sent()).filter(function (_) { return !!_; })[0];
                        return [2 /*return*/, modPath && path_1.resolve(this.root, modPath)];
                }
            });
        });
    };
    Injector.prototype.resolveArg = function (arg, modName, overloads) {
        if (overloads === void 0) { overloads = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var normalizedName, resolvedArg, resolvedArg, servicePath, mod, resolvedArg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        normalizedName = arg.replace(/^\$/, '');
                        if (normalizedName in overloads) {
                            resolvedArg = overloads[normalizedName];
                            return [2 /*return*/, resolvedArg];
                        }
                        if (normalizedName === 'moduleConfig') {
                            resolvedArg = this.getModuleConfig(modName);
                            return [2 /*return*/, resolvedArg];
                        }
                        if (normalizedName in this[props].resolvers) {
                            return [2 /*return*/, this[props].resolvers[normalizedName]];
                        }
                        return [4 /*yield*/, this.findModule(normalizedName)];
                    case 1:
                        servicePath = _a.sent();
                        if (!servicePath) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return require(servicePath); })];
                    case 2:
                        mod = (_a.sent())["default"];
                        if (!(typeof mod === 'function')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.runFunction(mod, normalizedName, overloads)];
                    case 3:
                        resolvedArg = _a.sent();
                        this[props].resolvers[normalizedName] = resolvedArg;
                        return [2 /*return*/, resolvedArg];
                    case 4:
                        if (mod) {
                            this[props].resolvers[modName] = mod;
                            return [2 /*return*/, mod];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Injector.prototype.runFunction = function (mod, modName, overloads) {
        if (overloads === void 0) { overloads = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var args, resolvedArgs, _i, args_1, arg, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        args = getArgs(mod.toString());
                        resolvedArgs = [];
                        _i = 0, args_1 = args;
                        _c.label = 1;
                    case 1:
                        if (!(_i < args_1.length)) return [3 /*break*/, 4];
                        arg = args_1[_i];
                        // console.log(arg)
                        // Todo prevent infinitee recursion
                        _b = (_a = resolvedArgs).push;
                        return [4 /*yield*/, this.resolveArg(arg, modName, overloads)];
                    case 2:
                        // console.log(arg)
                        // Todo prevent infinitee recursion
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, mod.apply(void 0, resolvedArgs)];
                }
            });
        });
    };
    Injector.prototype.run = function (fn, overloads) {
        if (overloads === void 0) { overloads = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var mod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fn = fn || '';
                        if (!(typeof fn === 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.resolveArg(fn, 'caller', overloads)];
                    case 1:
                        mod = _a.sent();
                        return [2 /*return*/, typeof mod === 'function'
                                ? this.runFunction(mod, 'caller', overloads)
                                : mod];
                    case 2: return [2 /*return*/, this.runFunction(fn, 'caller', overloads)];
                }
            });
        });
    };
    Injector.prototype.multipliy = function (services, overloads) {
        if (overloads === void 0) { overloads = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var isArray, resolved, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isArray = Array.isArray(services);
                        resolved = Object.entries(services).map(function (_a) {
                            var key = _a[0], fn = _a[1];
                            return function () { return __awaiter(_this, void 0, void 0, function () {
                                var mod;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.run(fn, overloads)];
                                        case 1:
                                            mod = _a.sent();
                                            return [2 /*return*/, [key, mod]];
                                    }
                                });
                            }); };
                        });
                        return [4 /*yield*/, Promise.all(resolved)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.reduce(function (result, _a) {
                                var key = _a[0], mod = _a[1];
                                isArray ? result.push(mod) : (result[key] = mod);
                                return result;
                            }, isArray ? [] : {})];
                }
            });
        });
    };
    return Injector;
}());
exports["default"] = Injector;
