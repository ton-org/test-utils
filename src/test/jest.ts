import type { MatcherFunction } from 'expect';
import { Address, Cell, Slice } from '@ton/core';

import { FlatTransactionComparable, compareTransactionForTest } from './transaction';
import { CompareResult } from './interface';
import { compareAddressForTest, compareCellForTest, compareSliceForTest } from './comparisons';

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
    const jestGlobals = require('@jest/globals');

    if (jestGlobals)
        jestGlobals.expect.extend({
            toHaveTransaction,
            toEqualCell,
            toEqualAddress,
            toEqualSlice,
        });
} catch (_) {}

declare global {
    export namespace jest {
        interface Matchers<R> {
            toHaveTransaction(cmp: FlatTransactionComparable): R;
            toEqualCell(cell: Cell): R;
            toEqualAddress(address: Address): R;
            toEqualSlice(slice: Slice): R;
        }
    }
}
