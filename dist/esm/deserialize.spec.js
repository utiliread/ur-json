var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import 'reflect-metadata';
import { expect } from 'chai';
import { jsonProperty } from './index';
import { modelBind } from './deserialize';
var Model = /** @class */ (function () {
    function Model() {
        this.number = undefined;
        this.string = undefined;
        this.arrayBuffer = undefined;
    }
    __decorate([
        jsonProperty(),
        __metadata("design:type", ArrayBuffer)
    ], Model.prototype, "arrayBuffer", void 0);
    return Model;
}());
describe('modelBind', function () {
    it('should correctly deserialize to model', function () {
        var source = new Model();
        var result = modelBind(Model, JSON.parse('{"number":1337,"string":"hello","arrayBuffer":"Ezc="}'));
        if (result) {
            expect(result.number).equals(1337);
            expect(result.string).equals('hello');
            expect(result.arrayBuffer).deep.equals(new Uint8Array([0x13, 0x37]).buffer);
        }
        else {
            expect.fail();
        }
    });
});
//# sourceMappingURL=deserialize.spec.js.map