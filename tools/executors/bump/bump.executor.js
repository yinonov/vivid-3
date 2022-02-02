"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function bumpExecutor(options, context) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        return (0, tslib_1.__generator)(this, function (_a) {
          console.log("Bumping to version " + options.version);
          return [2 /*return*/, { success: true }];
        });
    });
}
exports.default = bumpExecutor;
//# sourceMappingURL=bump.executor.js.map
