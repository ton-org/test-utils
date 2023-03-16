import { CompareResult } from "./interface";
import { compareTransactionForTest, FlatTransactionComparable } from "./transaction";

function wrapComparer<T>(comparer: (subject: any, cmp: T) => CompareResult) {
    return function (this: any, cmp: T) {
        const result = comparer(this._obj, cmp)
        this.assert(result.pass, result.posMessage(), result.negMessage())
    }
}

function supportTransaction(Assertion: Chai.AssertionStatic) {
    Assertion.addMethod('transaction', wrapComparer(compareTransactionForTest))
}

try {
    const chai = require("chai");

    if (chai) chai.use((chai: Chai.ChaiStatic) => {
        supportTransaction(chai.Assertion)
    })
} catch (e) {}

declare global {
    export namespace Chai {
        interface Assertion {
            transaction(cmp: FlatTransactionComparable): void
        }
    }
}