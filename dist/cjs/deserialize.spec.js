"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var chai_1 = require("chai");
var index_1 = require("./index");
var deserialize_1 = require("./deserialize");
var Model = /** @class */ (function () {
    function Model() {
    }
    __decorate([
        (0, index_1.jsonProperty)(),
        __metadata("design:type", Number)
    ], Model.prototype, "number", void 0);
    __decorate([
        (0, index_1.jsonProperty)(),
        __metadata("design:type", String)
    ], Model.prototype, "string", void 0);
    __decorate([
        (0, index_1.jsonProperty)(),
        __metadata("design:type", Array)
    ], Model.prototype, "numberArray", void 0);
    __decorate([
        (0, index_1.jsonProperty)(),
        __metadata("design:type", Array)
    ], Model.prototype, "stringArray", void 0);
    __decorate([
        (0, index_1.jsonProperty)(),
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
        (0, index_1.jsonProperty)(),
        __metadata("design:type", ArrayBuffer)
    ], Model2.prototype, "arrayBuffer", void 0);
    return Model2;
}());
var PlusOneConverter = /** @class */ (function () {
    function PlusOneConverter() {
    }
    PlusOneConverter.prototype.fromJson = function (value) {
        return value + 1;
    };
    PlusOneConverter.instance = new PlusOneConverter();
    return PlusOneConverter;
}());
var AppendTestConverter = /** @class */ (function () {
    function AppendTestConverter() {
    }
    AppendTestConverter.prototype.fromJson = function (value) {
        return value + "test";
    };
    AppendTestConverter.instance = new AppendTestConverter();
    return AppendTestConverter;
}());
var PolyBase = /** @class */ (function () {
    function PolyBase() {
    }
    __decorate([
        (0, index_1.jsonProperty)({ converter: PlusOneConverter.instance }),
        __metadata("design:type", Number)
    ], PolyBase.prototype, "id", void 0);
    return PolyBase;
}());
var PolySub = /** @class */ (function (_super) {
    __extends(PolySub, _super);
    function PolySub() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, index_1.jsonProperty)({ converter: AppendTestConverter.instance }),
        __metadata("design:type", String)
    ], PolySub.prototype, "sub", void 0);
    return PolySub;
}(PolyBase));
describe('modelBind', function () {
    it('should correctly deserialize a simple array with primitives array', function () {
        var result = (0, deserialize_1.modelBind)(Array, JSON.parse('[1,"b",null]'));
        if (result) {
            (0, chai_1.expect)(result).deep.equals([1, "b", null]);
        }
        else {
            chai_1.expect.fail();
        }
    });
    it('should correctly deserialize to model', function () {
        var result = (0, deserialize_1.modelBind)(Model, JSON.parse('{"number":1337,"string":"hello","numberArray":[1,2],"stringArray":["a","b"],"arrayBuffer":"Ezc="}'));
        if (result) {
            (0, chai_1.expect)(result.number).equals(1337);
            (0, chai_1.expect)(result.string).equals('hello');
            (0, chai_1.expect)(result.numberArray).deep.equals([1, 2]);
            (0, chai_1.expect)(result.stringArray).deep.equals(["a", "b"]);
            (0, chai_1.expect)(result.arrayBuffer).deep.equals(new Uint8Array([0x13, 0x37]).buffer);
        }
        else {
            chai_1.expect.fail();
        }
    });
    it('should correctly deserialize to model2', function () {
        var result = (0, deserialize_1.modelBind)(Model2, JSON.parse('{"number":1337,"string":"hello","numberArray":[1,2],"stringArray":["a","b"],"arrayBuffer":"Ezc="}'));
        if (result) {
            (0, chai_1.expect)(result.number).equals(1337);
            (0, chai_1.expect)(result.string).equals('hello');
            (0, chai_1.expect)(result.numberArray).deep.equals([1, 2]);
            (0, chai_1.expect)(result.stringArray).deep.equals(["a", "b"]);
            (0, chai_1.expect)(result.arrayBuffer).deep.equals(new Uint8Array([0x13, 0x37]).buffer);
        }
        else {
            chai_1.expect.fail();
        }
    });
    it("should support polymorphic models", function () {
        var result = (0, deserialize_1.modelBind)(PolySub, JSON.parse('{"id":1,"sub":"hello"}'));
        (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.id).equals(2);
        (0, chai_1.expect)(result === null || result === void 0 ? void 0 : result.sub).equals("hellotest");
    });
});
//# sourceMappingURL=deserialize.spec.js.map