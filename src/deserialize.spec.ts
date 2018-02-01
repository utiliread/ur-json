import 'reflect-metadata';

import { expect } from 'chai';
import { jsonProperty } from './index';
import { modelBind } from './deserialize';

class Model {
    number?: string = undefined;
    string?: string = undefined;
    @jsonProperty()
    arrayBuffer?: ArrayBuffer = undefined;
}

describe('modelBind', () => {
    it('should correctly deserialize to model', () => {
        const source = new Model();
        const result = modelBind(Model, JSON.parse('{"number":1337,"string":"hello","arrayBuffer":"Ezc="}'));

        if (result) {
            expect(result.number).equals(1337);
            expect(result.string).equals('hello');
            expect(result.arrayBuffer).deep.equals(new Uint8Array([0x13, 0x37]).buffer);
        }
        else {
            expect.fail();
        }
    })
})