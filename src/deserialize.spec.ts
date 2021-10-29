import 'reflect-metadata';

import { expect } from 'chai';
import { jsonProperty } from './index';
import { modelBind } from './deserialize';
import { JsonConverter } from './json-converter';

class Model {
    @jsonProperty()
    number!: number;
    @jsonProperty()
    string!: string;
    @jsonProperty()
    numberArray!: number[];
    @jsonProperty()
    stringArray!: string[];
    @jsonProperty()
    arrayBuffer!: ArrayBuffer;
}

class Model2 {
    number?: number = undefined;
    string?: string = undefined;
    numberArray?: number[] = undefined;
    stringArray?: string[] = undefined;
    @jsonProperty()
    arrayBuffer?: ArrayBuffer = undefined;
}

class PlusOneConverter implements JsonConverter {
    public static readonly instance = new PlusOneConverter();
    fromJson(value: any) {
        return value + 1;
    }
}

class AppendTestConverter implements JsonConverter {
    public static readonly instance = new AppendTestConverter();
    fromJson(value: any) {
        return value + "test";
    }
}

class PolyBase {
    @jsonProperty({converter: PlusOneConverter.instance})
    id!: number;
}

class PolySub extends PolyBase {
    @jsonProperty({converter: AppendTestConverter.instance})
    sub!: string;
}

describe('modelBind', () => {
    it('should correctly deserialize a simple array with primitives array', () => {
        const result = modelBind(Array, JSON.parse('[1,"b",null]'));

        if (result) {
            expect(result).deep.equals([1, "b", null]);
        }
        else {
            expect.fail();
        }
    });

    it('should correctly deserialize to model', () => {
        const result = modelBind(Model, JSON.parse('{"number":1337,"string":"hello","numberArray":[1,2],"stringArray":["a","b"],"arrayBuffer":"Ezc="}'));

        if (result) {
            expect(result.number).equals(1337);
            expect(result.string).equals('hello');
            expect(result.numberArray).deep.equals([1,2]);
            expect(result.stringArray).deep.equals(["a", "b"]);
            expect(result.arrayBuffer).deep.equals(new Uint8Array([0x13, 0x37]).buffer);
        }
        else {
            expect.fail();
        }
    });

    it('should correctly deserialize to model2', () => {
        const result = modelBind(Model2, JSON.parse('{"number":1337,"string":"hello","numberArray":[1,2],"stringArray":["a","b"],"arrayBuffer":"Ezc="}'));

        if (result) {
            expect(result.number).equals(1337);
            expect(result.string).equals('hello');
            expect(result.numberArray).deep.equals([1,2]);
            expect(result.stringArray).deep.equals(["a", "b"]);
            expect(result.arrayBuffer).deep.equals(new Uint8Array([0x13, 0x37]).buffer);
        }
        else {
            expect.fail();
        }
    });

    it("should support polymorphic models", () => {
        const result = modelBind(PolySub, JSON.parse('{"id":1,"sub":"hello"}'));
        expect(result?.id).equals(2);
        expect(result?.sub).equals("hellotest");
    });
});