import "reflect-metadata";

import { expect } from "chai";
import { jsonProperty } from "./index";
import { deserialize } from "./deserialize";
import { JsonConverter } from "./json-converter";

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
  @jsonProperty({ converter: PlusOneConverter.instance })
  id!: number;
}

class PolySub extends PolyBase {
  @jsonProperty({ converter: AppendTestConverter.instance })
  sub!: string;
}

describe("deserialize", () => {
  it("should correctly deserialize a simple array with primitives array", () => {
    const source = JSON.parse('[1,"b",null]');
    const result = deserialize(source, Array);

    if (result) {
      expect(result).deep.equals([1, "b", null]);
    } else {
      expect.fail();
    }
  });

  it("should correctly deserialize to model", () => {
    const source = JSON.parse(
      '{"number":1337,"string":"hello","numberArray":[1,2],"stringArray":["a","b"],"arrayBuffer":"Ezc="}'
    );
    const result = deserialize(source, Model);

    if (result) {
      expect(result.number).equals(1337);
      expect(result.string).equals("hello");
      expect(result.numberArray).deep.equals([1, 2]);
      expect(result.stringArray).deep.equals(["a", "b"]);
      expect(result.arrayBuffer).deep.equals(
        new Uint8Array([0x13, 0x37]).buffer
      );
    } else {
      expect.fail();
    }
  });

  it("should correctly deserialize to model2", () => {
    const source = JSON.parse(
      '{"number":1337,"string":"hello","numberArray":[1,2],"stringArray":["a","b"],"arrayBuffer":"Ezc="}'
    );
    const result = deserialize(source, Model2);

    if (result) {
      expect(result.number).equals(1337);
      expect(result.string).equals("hello");
      expect(result.numberArray).deep.equals([1, 2]);
      expect(result.stringArray).deep.equals(["a", "b"]);
      expect(result.arrayBuffer).deep.equals(
        new Uint8Array([0x13, 0x37]).buffer
      );
    } else {
      expect.fail();
    }
  });

  it("should support polymorphic models", () => {
    const source = JSON.parse('{"id":1,"sub":"hello"}');
    const result = deserialize(source, PolySub);
    expect(result?.id).equals(2);
    expect(result?.sub).equals("hellotest");
  });
});
