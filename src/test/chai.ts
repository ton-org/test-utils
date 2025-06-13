import { Address, Cell, Slice } from '@ton/core';

import { compareAddressForTest, compareCellForTest, compareSliceForTest } from './comparisons';
import { CompareResult } from './interface';
import { compareTransactionForTest, FlatTransactionComparable } from './transaction';
import { compareThrownExitCodeForTest } from './exitCode';

function wrapComparer<T>(comparer: (subject: unknown, cmp: T) => CompareResult | Promise<CompareResult>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (this: any, cmp: T) {
        const assertResult = (result: CompareResult) => {
            this.assert(result.pass, result.posMessage(), result.negMessage());
        };
        const result = comparer(this._obj, cmp);
        if (result instanceof Promise) {
            return result.then(assertResult);
        }
        return assertResult(result);
    };
}

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const chai = require('chai');

    if (chai)
        // eslint-disable-next-line no-undef
        chai.use((chai: Chai.ChaiStatic) => {
            const Assertion = chai.Assertion;
            Assertion.addMethod('transaction', wrapComparer(compareTransactionForTest));
            Assertion.addMethod('equalCell', wrapComparer(compareCellForTest));
            Assertion.addMethod('equalAddress', wrapComparer(compareAddressForTest));
            Assertion.addMethod('equalSlice', wrapComparer(compareSliceForTest));
            Assertion.addMethod('throwExitCode', wrapComparer(compareThrownExitCodeForTest));
        });
    // eslint-disable-next-line no-empty
} catch (_) {}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Chai {
        interface Assertion {
            transaction(cmp: FlatTransactionComparable): void;
            equalCell(cell: Cell): void;
            equalAddress(address: Address): void;
            equalSlice(slice: Slice): void;
            /**
             * @example
             * await expect(() => blockchain.runGetMethod(contract.address, 'test')).to.throwExitCode(11);
             */
            throwExitCode(code: number): Promise<void>;
        }
    }
}
