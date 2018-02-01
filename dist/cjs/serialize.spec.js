"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const serialize_1 = require("./serialize");
class Model {
    constructor() {
        this.number = 1337;
        this.string = 'hello';
        this.arrayBuffer = new ArrayBuffer(2);
        new Uint8Array(this.arrayBuffer).set([0x13, 0x37]);
    }
}
describe('serialize', () => {
    it('should correctly serialize model', () => {
        const source = new Model();
        const result = serialize_1.serialize(source);
        chai_1.expect(result).to.equal('{"number":1337,"string":"hello","arrayBuffer":"Ezc="}');
    });
});
//# sourceMappingURL=serialize.spec.js.map