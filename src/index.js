"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
var async = require("async");
var globalLoggingFunc;
function withLogging(loggingFunc) {
    globalLoggingFunc = loggingFunc;
    return this;
}
exports.withLogging = withLogging;
function Recipe(model, defaultAttributes) {
    return function (overrideAttributes) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var attributes, resolvedAttributes_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attributes = __assign({}, defaultAttributes, overrideAttributes);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, resolveAttributes(attributes)];
                    case 2:
                        resolvedAttributes_1 = _a.sent();
                        model.create(resolvedAttributes_1, function (err, createdRecord) {
                            if (err) {
                                if (globalLoggingFunc) {
                                    globalLoggingFunc("" + err);
                                }
                                return reject(err);
                            }
                            if (globalLoggingFunc) {
                                globalLoggingFunc("Created " + model.definition.name + " with attributes " + JSON.stringify(resolvedAttributes_1));
                            }
                            return resolve(createdRecord);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        reject(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}
exports.Recipe = Recipe;
function UserRecipe(userModel, defaultAttributes) {
    var _this = this;
    var _roleName;
    var _roleModel;
    var _rolePrincipalType;
    var userRecipe = Recipe(userModel, defaultAttributes);
    var recipe = function (overrideAttributes) { return __awaiter(_this, void 0, void 0, function () {
        var roleRecord, userRecord;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!_roleName) {
                        return [2 /*return*/, userRecipe(overrideAttributes)];
                    }
                    return [4 /*yield*/, findOrCreateRole(_roleModel, _roleName)];
                case 1:
                    roleRecord = _a.sent();
                    return [4 /*yield*/, userRecipe(overrideAttributes)];
                case 2:
                    userRecord = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            roleRecord.principals.create({
                                principalType: _rolePrincipalType,
                                principalId: userRecord.id
                            }, function (err, record) {
                                if (err) {
                                    return reject(err);
                                }
                                return resolve(record);
                            });
                        })];
            }
        });
    }); };
    recipe.withRole = function (roleName, roleModel, rolePrincipalType) {
        if (rolePrincipalType === void 0) { rolePrincipalType = 'User'; }
        _roleName = roleName;
        _roleModel = roleModel;
        _rolePrincipalType = rolePrincipalType;
        return recipe;
    };
    return recipe;
}
exports.UserRecipe = UserRecipe;
function findOrCreateRole(roleModel, roleName) {
    return new Promise(function (resolve, reject) {
        roleModel.findOrCreate({
            where: {
                name: roleName
            }
        }, function (err, roleRecord) {
            if (err) {
                return reject(err);
            }
            return resolve(roleRecord);
        });
    });
}
function resolveAttributes(attributes) {
    return new Promise(function (resolve, reject) {
        var attrKeys = [];
        for (var attrKey in attributes) {
            if (attributes.hasOwnProperty(attrKey)) {
                attrKeys.push(attrKey);
            }
        }
        var resolvedAttributes = {};
        async.eachSeries(attrKeys, function (attrKey, cb) {
            if (typeof attributes[attrKey] !== 'function') {
                resolvedAttributes[attrKey] = attributes[attrKey];
                return cb();
            }
            var value = attributes[attrKey]();
            if (!isThennable(value)) {
                resolvedAttributes[attrKey] = value;
                return cb();
            }
            value.then(function (resolvedValue) {
                resolvedAttributes[attrKey] = resolvedValue;
                cb();
            }).catch(function (err) {
                cb(err);
            });
        }, function (err) {
            if (err) {
                return reject(err);
            }
            return resolve(resolvedAttributes);
        });
    });
}
function isThennable(val) {
    return val.then && val.catch;
}
//# sourceMappingURL=index.js.map