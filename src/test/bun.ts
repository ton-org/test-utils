import type { MatcherFunction } from 'expect';
import { Address, Cell, Slice } from '@ton/core';

import { FlatTransactionComparable, compareTransactionForTest } from './transaction';
import { CompareResult } from './interface';
import { compareAddressForTest, compareCellForTest, compareSliceForTest } from './comparisons';
import { compareThrownExitCodeForTest } from './exitCode';

function extractResult(result: CompareResult) {
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
}

function wrapComparer<T>(
    comparer: (subject: unknown, cmp: T) => CompareResult | Promise<CompareResult>,
): MatcherFunction<[cmp: T]> {
    return function (actual, cmp) {
        const result = comparer(actual, cmp);
        if (result instanceof Promise) {
            return result.then(extractResult);
        }
        return extractResult(result);
    };
}

const toHaveTransaction = wrapComparer(compareTransactionForTest);
const toEqualCell = wrapComparer(compareCellForTest);
const toEqualAddress = wrapComparer(compareAddressForTest);
const toEqualSlice = wrapComparer(compareSliceForTest);
const toThrowExitCode = wrapComparer(compareThrownExitCodeForTest);

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const bunTest = require('bun:test');

    if (bunTest && bunTest.expect)
        bunTest.expect.extend({
            toHaveTransaction,
            toEqualCell,
            toEqualAddress,
            toEqualSlice,
            toThrowExitCode,
        });
    // eslint-disable-next-line no-empty
} catch (_) {}

interface TonMatchers<T> {
    toHaveTransaction(cmp: FlatTransactionComparable): T;
    toEqualCell(cell: Cell): T;
    toEqualAddress(address: Address): T;
    toEqualSlice(slice: Slice): T;

    /**
     * @example
     * await expect(() => blockchain.runGetMethod(contract.address, 'test')).toThrowExitCode(11);
     */
    toThrowExitCode(exitCode: number): Promise<T>;
}

declare module 'bun:test' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Matchers<T> extends TonMatchers<T> {}
}
