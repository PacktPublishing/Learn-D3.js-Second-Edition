// Import the function to be tested
import { describe, test, expect } from '@jest/globals';
import { nest, rootFromRollup, obtainRootNode, findNamedRoot } from './nest';

describe('nest', () => {
    it('should return the data as-is when depth is greater than or equal to levels', () => {
        const data = [[1, 'a'], [2, 'b']];
        const levels = 1;
        const depth = 1;

        const result = nest(data, levels, depth);

        expect(result).toEqual(data);
    });

    it('should return a nested structure for the last level', () => {
        const data = [[1, 'a'], [2, 'b']];
        const levels = 1;

        const result = nest(data, levels);

        expect(result).toEqual([
            { key: 1, value: 'a' },
            { key: 2, value: 'b' }
        ]);
    });

    it('should return a fully nested structure for multiple levels', () => {
        const data = [[1, [[2, 'a'], [3, 'b']]]];
        const levels = 2;

        const result = nest(data, levels);

        expect(result).toEqual([
            {
                key: 1,
                values: [
                    { key: 2, value: 'a' },
                    { key: 3, value: 'b' }
                ]
            }
        ]);
    });
});

describe('findNamedRoot', () => {
    it('should return the existing root node if it exists', () => {
        const nestedData = [
            { key: 'root', values: [] },
            { key: 'other', values: [] }
        ];
        const rootKey = 'root';

        const result = findNamedRoot(nestedData, rootKey);

        expect(result.key).toEqual('root');
    });

    it('should return null if root node is not found', () => {
        const nestedData = [
            { key: 'child1', values: [] },
            { key: 'child2', values: [] }
        ];
        const rootKey = 'root';

        const result = findNamedRoot(nestedData, rootKey);
        console.log('findNamedRoot undefined result: ', result)

        expect(result).toBeUndefined();
    });
});

describe('obtainRootNode', () => {
    // Test for existing root key
    it('should return the root node when it exists', () => {
        const nestedData = [
            { key: 'root', values: [] },
            { key: 'other', values: [] }
        ];
        const rootKey = 'root';

        const result = obtainRootNode(nestedData, rootKey);

        expect(result.key).toEqual('root'); // just test for the key, since this function transforms the data
    });

    // Test for null, 'null', or '' node
    it('should return the first child of a null, "null", or "" node', () => {
        const nestedData = [
            { key: 'null', values: [{ key: 'root', value: {a: 'valueA', b: 'valueB'} }] },
            { key: 'root', values: [] },
            { key: 'child', values: [] }
        ];
        const rootKey = 'root'; // Will look for named root inside 'null' key

        const result = obtainRootNode(nestedData, rootKey);
        console.log('null node result: ', result)

        expect(result).toEqual({ key: 'root', a: 'valueA', b: 'valueB', values: []});
    });
    // TODO: repeat test above for null and '' keys

    // Test for no root key
    it('should create a root node when no root key exists, and put existing content as children', () => {
        const nestedData = [
            { key: 'child1', values: [] },
            { key: 'child2', values: [] }
        ];
        const rootKey = 'root';

        const result = obtainRootNode(nestedData, rootKey);

        expect(result).toEqual({ key: 'root', values: nestedData });
    });

});

describe('rootFromNest', () => {

});

describe('rootFromRollup', () => {

});