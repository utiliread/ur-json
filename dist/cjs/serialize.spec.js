"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var serialize_1 = require("./serialize");
var Model = /** @class */ (function () {
    function Model() {
        this.number = 1337;
        this.string = 'hello';
        this.arrayBuffer = new ArrayBuffer(2);
        new Uint8Array(this.arrayBuffer).set([0x13, 0x37]);
    }
    return Model;
}());
describe('serialize', function () {
    it('should correctly serialize model', function () {
        var source = new Model();
        var result = serialize_1.serialize(source);
        chai_1.expect(result).to.equal('{"number":1337,"string":"hello","arrayBuffer":"Ezc="}');
    });
});
//# sourceMappingURL=serialize.spec.js.map