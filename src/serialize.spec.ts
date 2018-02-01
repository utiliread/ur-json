import { expect } from 'chai';
import { serialize } from './serialize';

class Model {
    number = 1337;
    string = 'hello';
    arrayBuffer = new ArrayBuffer(2);

    constructor() {
        new Uint8Array(this.arrayBuffer).set([0x13, 0x37]);
    }
}

describe('serialize', () => {
    it('should correctly serialize model', () => {
        const source = new Model();
        const result = serialize(source);

        expect(result).to.equal('{"number":1337,"string":"hello","arrayBuffer":"Ezc="}');
    })
})