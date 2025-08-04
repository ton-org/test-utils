import 'expect';
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
    const jestGlobals = require('@jest/globals');

    if (jestGlobals)
        jestGlobals.expect.extend({
            toHaveTransaction,
            toEqualCell,
            toEqualAddress,
            toEqualSlice,
            toThrowExitCode,
        });
    // eslint-disable-next-line no-empty
} catch (_) {}

interface TonMatchers<R> {
    toHaveTransaction(cmp: FlatTransactionComparable): R;
    toEqualCell(cell: Cell): R;
    toEqualAddress(address: Address): R;
    toEqualSlice(slice: Slice): R;

    /**
     * @example
     * await expect(() => blockchain.runGetMethod(contract.address, 'test')).toThrowExitCode(11);
     */
    toThrowExitCode(exitCode: number): Promise<R>;
}

/* eslint-disable @typescript-eslint/no-empty-object-type */

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace jest {
        interface Matchers<R> extends TonMatchers<R> {}
    }
}

declare module 'expect' {
    interface Matchers<R> extends TonMatchers<R> {}
}
