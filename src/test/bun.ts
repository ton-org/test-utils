import type { MatcherFunction } from 'expect';
import { Address, Cell, Slice } from '@ton/core';

import { FlatTransactionComparable, compareTransactionForTest } from './transaction';
import { CompareResult } from './interface';
import { compareAddressForTest, compareCellForTest, compareSliceForTest } from './comparisons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapComparer<T>(comparer: (subject: any, cmp: T) => CompareResult): MatcherFunction<[cmp: T]> {
    return function (actual, cmp) {
        const result = comparer(actual, cmp);
        return {
            pass: result.pass,
            message: () => {
                if (result.pass) {
                    return result.negMessage();
                } else {
                    return result.posMessage();
                }
            },
        };
    };
}

const toHaveTransaction = wrapComparer(compareTransactionForTest);
const toEqualCell = wrapComparer(compareCellForTest);
const toEqualAddress = wrapComparer(compareAddressForTest);
const toEqualSlice = wrapComparer(compareSliceForTest);

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const bunTest = require('bun:test');

    if (bunTest && bunTest.expect)
        bunTest.expect.extend({
            toHaveTransaction,
            toEqualCell,
            toEqualAddress,
            toEqualSlice,
        });
    // eslint-disable-next-line no-empty
} catch (_) {}

interface TonMatchers<T> {
    toHaveTransaction(cmp: FlatTransactionComparable): T;
    toEqualCell(cell: Cell): T;
    toEqualAddress(address: Address): T;
    toEqualSlice(slice: Slice): T;
}

// @ts-ignore: Module 'bun:test' is only available in bun environment
declare module 'bun:test' {
    interface Matchers<T> extends TonMatchers<T> {}
}
