"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var LoopbackModelMock = (function () {
    function LoopbackModelMock() {
        this.definition = {
            name: 'ModelMock'
        };
        this.create = function (data, cb) {
            var _this = this;
            process.nextTick(function () {
                cb(_this.create.error, __assign({}, _this.create.data, data));
            });
        };
        this.findOrCreate = function (filter, data, cb) {
            var _this = this;
            process.nextTick(function () {
                cb(_this.findOrCreate.error, __assign({}, _this.findOrCreate.data, data));
            });
        };
    }
    return LoopbackModelMock;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoopbackModelMock;
//# sourceMappingURL=LoopbackModelMock.js.map