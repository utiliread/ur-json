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
    }
    __decorate([
        jsonProperty(),
        __metadata("design:type", Number)
    ], Model.prototype, "number", void 0);
    __decorate([
        jsonProperty(),
        __metadata("design:type", String)
    ], Model.prototype, "string", void 0);
    __decorate([
        jsonProperty(),
        __metadata("design:type", Array)
    ], Model.prototype, "numberArray", void 0);
    __decorate([
        jsonProperty(),
        __metadata("design:type", Array)
    ], Model.prototype, "stringArray", void 0);
    __decorate([
        jsonProperty(),
        __metadata("design:type", ArrayBuffer)
    ], Model.prototype, "arrayBuffer", void 0);
    return Model;
}());
var Model2 = /** @class */ (function () {
    function Model2() {
        this.number = undefined;
        this.string = undefined;
        this.numberArray = undefined;
        this.stringArray = undefined;
        this.arrayBuffer = undefined;
    }
    __decorate([
        jsonProperty(),
        __metadata("design:type", ArrayBuffer)
    ], Model2.prototype, "arrayBuffer", void 0);
    return Model2;
}());
describe('modelBind', function () {
    it('should correctly deserialize a simple array with primitives array', function () {
        var result = modelBind(Array, JSON.parse('[1,"b",null]'));
        if (result) {
            expect(result).deep.equals([1, "b", null]);
        }
        else {
            expect.fail();
        }
    });
    it('should correctly deserialize to model', function () {
        var result = modelBind(Model, JSON.parse('{"number":1337,"string":"hello","numberArray":[1,2],"stringArray":["a","b"],"arrayBuffer":"Ezc="}'));
        if (result) {
            expect(result.number).equals(1337);
            expect(result.string).equals('hello');
            expect(result.numberArray).deep.equals([1, 2]);
            expect(result.stringArray).deep.equals(["a", "b"]);
            expect(result.arrayBuffer).deep.equals(new Uint8Array([0x13, 0x37]).buffer);
        }
        else {
            expect.fail();
        }
    });
    it('should correctly deserialize to model2', function () {
        var result = modelBind(Model2, JSON.parse('{"number":1337,"string":"hello","numberArray":[1,2],"stringArray":["a","b"],"arrayBuffer":"Ezc="}'));
        if (result) {
            expect(result.number).equals(1337);
            expect(result.string).equals('hello');
            expect(result.numberArray).deep.equals([1, 2]);
            expect(result.stringArray).deep.equals(["a", "b"]);
            expect(result.arrayBuffer).deep.equals(new Uint8Array([0x13, 0x37]).buffer);
        }
        else {
            expect.fail();
        }
    });
});
//# sourceMappingURL=deserialize.spec.js.map