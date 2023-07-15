import { Address, Cell, Slice } from "@ton/core";
import { compareAddressForTest, compareCellForTest, compareSliceForTest } from "./comparisons";
import { CompareResult } from "./interface";
import { compareTransactionForTest, FlatTransactionComparable } from "./transaction";

function wrapComparer<T>(comparer: (subject: any, cmp: T) => CompareResult) {
    return function (this: any, cmp: T) {
        const result = comparer(this._obj, cmp)
        this.assert(result.pass, result.posMessage(), result.negMessage())
    }
}

try {
    const chai = require("chai");

    if (chai) chai.use((chai: Chai.ChaiStatic) => {
        const Assertion = chai.Assertion
        Assertion.addMethod('transaction', wrapComparer(compareTransactionForTest))
        Assertion.addMethod('equalCell', wrapComparer(compareCellForTest))
        Assertion.addMethod('equalAddress', wrapComparer(compareAddressForTest))
        Assertion.addMethod('equalSlice', wrapComparer(compareSliceForTest))
    })
} catch (e) {}

declare global {
    export namespace Chai {
        interface Assertion {
            transaction(cmp: FlatTransactionComparable): void
            equalCell(cell: Cell): void
            equalAddress(address: Address): void
            equalSlice(slice: Slice): void
        }
    }
}