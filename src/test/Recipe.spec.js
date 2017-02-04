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
var _this = this;
require('source-map-support').install();
var bakery = require("../index");
var LoopbackModelMock_1 = require("./LoopbackModelMock");
var chai = require("chai");
var sinon = require("sinon");
var expect = chai.expect;
describe('bakery', function () {
    describe('Recipe', function () {
        var model;
        beforeEach(function () {
            model = new LoopbackModelMock_1.default();
            sinon.stub(model, 'create', model.create);
            model.nextId = 5;
        });
        it('should create a new model with the passed attributes', function () { return __awaiter(_this, void 0, void 0, function () {
            var recipe, record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipe = bakery.Recipe(model);
                        return [4 /*yield*/, recipe({ name: 'Steven', email: 'steven@mail.test' })];
                    case 1:
                        record = _a.sent();
                        sinon.assert.alwaysCalledWithExactly(model.create, { name: 'Steven', email: 'steven@mail.test' }, sinon.match.func);
                        expect(record.id).to.equal(5);
                        expect(record.name).to.equal('Steven');
                        expect(record.email).to.equal('steven@mail.test');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use default attributes if defined and not overwritten by the make arguments', function () { return __awaiter(_this, void 0, void 0, function () {
            var recipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipe = bakery.Recipe(model, {
                            name: 'Richard'
                        });
                        return [4 /*yield*/, recipe({ email: 'steven@mail.test' })];
                    case 1:
                        _a.sent();
                        sinon.assert.alwaysCalledWithExactly(model.create, { name: 'Richard', email: 'steven@mail.test' }, sinon.match.func);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should NOT use default attributes if defined but overwritten by the make arguments', function () { return __awaiter(_this, void 0, void 0, function () {
            var recipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipe = bakery.Recipe(model, {
                            name: 'Richard'
                        });
                        return [4 /*yield*/, recipe({ name: 'Steven', email: 'steven@mail.test' })];
                    case 1:
                        _a.sent();
                        sinon.assert.alwaysCalledWithExactly(model.create, { name: 'Steven', email: 'steven@mail.test' }, sinon.match.func);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow passing functions to create attribute values', function () { return __awaiter(_this, void 0, void 0, function () {
            var recipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipe = bakery.Recipe(model, {
                            name: function () {
                                return 'Richard';
                            }
                        });
                        return [4 /*yield*/, recipe({ email: 'steven@mail.test' })];
                    case 1:
                        _a.sent();
                        sinon.assert.alwaysCalledWithExactly(model.create, { name: 'Richard', email: 'steven@mail.test' }, sinon.match.func);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow passing functions to create attribute values that return a promise', function () { return __awaiter(_this, void 0, void 0, function () {
            var recipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipe = bakery.Recipe(model, {
                            name: function () {
                                return new Promise(function (resolve) {
                                    process.nextTick(function () {
                                        resolve('Richard');
                                    });
                                });
                            }
                        });
                        return [4 /*yield*/, recipe({ email: 'steven@mail.test' })];
                    case 1:
                        _a.sent();
                        sinon.assert.alwaysCalledWithExactly(model.create, { name: 'Richard', email: 'steven@mail.test' }, sinon.match.func);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail if creating the model returned an error', function () { return __awaiter(_this, void 0, void 0, function () {
            var caughtError, recipe, record, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model.create.error = new Error('Creating the model failed');
                        recipe = bakery.Recipe(model);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, recipe({ name: 'Steven', email: 'steven@mail.test' })];
                    case 2:
                        record = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        caughtError = err_1;
                        return [3 /*break*/, 4];
                    case 4:
                        expect(caughtError.message).to.equal('Creating the model failed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should fail if an attribute promise returned an error', function () { return __awaiter(_this, void 0, void 0, function () {
            var caughtError, recipe, record, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        recipe = bakery.Recipe(model, {
                            name: function () {
                                return new Promise(function (resolve, reject) {
                                    process.nextTick(function () {
                                        reject(new Error('Promise did not resolve'));
                                    });
                                });
                            }
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, recipe({ email: 'steven@mail.test' })];
                    case 2:
                        record = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        caughtError = err_2;
                        return [3 /*break*/, 4];
                    case 4:
                        expect(caughtError.message).to.equal('Promise did not resolve');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=Recipe.spec.js.map