"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const chai_1 = require("chai");
const index_1 = require("./index");
const deserialize_1 = require("./deserialize");
class Model {
    constructor() {
        this.number = undefined;
        this.string = undefined;
        this.arrayBuffer = undefined;
    }
}
__decorate([
    index_1.jsonProperty(),
    __metadata("design:type", ArrayBuffer)
], Model.prototype, "arrayBuffer", void 0);
describe('modelBind', () => {
    it('should correctly deserialize to model', () => {
        const source = new Model();
        const result = deserialize_1.modelBind(Model, JSON.parse('{"number":1337,"string":"hello","arrayBuffer":"Ezc="}'));
        if (result) {
            chai_1.expect(result.number).equals(1337);
            chai_1.expect(result.string).equals('hello');
            chai_1.expect(result.arrayBuffer).deep.equals(new Uint8Array([0x13, 0x37]).buffer);
        }
        else {
            chai_1.expect.fail();
        }
    });
});
//# sourceMappingURL=deserialize.spec.js.map