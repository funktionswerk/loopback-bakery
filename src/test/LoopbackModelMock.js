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
        this.create = function (data, cb) {
            var _this = this;
            process.nextTick(function () {
                cb(_this.create.error, __assign({ id: _this.nextId }, data));
            });
        };
    }
    return LoopbackModelMock;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoopbackModelMock;
//# sourceMappingURL=LoopbackModelMock.js.map