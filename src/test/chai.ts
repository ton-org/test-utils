import { compareTransactionForTest, FlatTransactionComparable } from "./transaction";

function supportTransaction(Assertion: Chai.AssertionStatic) {
    Assertion.addMethod('transaction', function (this: any, cmp: FlatTransactionComparable) {
        const result = compareTransactionForTest(this._obj, cmp)
        this.assert(result.pass, result.posMessage, result.negMessage)
    })
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