import { FlatTransactionComparable, compareTransactionForTest } from "./transaction";
import type { MatcherFunction } from "expect";

const toHaveTransaction: MatcherFunction<[cmp: FlatTransactionComparable]> = function(actual, cmp) {
    const result = compareTransactionForTest(actual, cmp)
    return {
        pass: result.pass,
        message: () => result.pass ? result.negMessage : result.posMessage,
    }
}

try {
    const jestGlobals = require("@jest/globals");

    if (jestGlobals) jestGlobals.expect.extend({
        toHaveTransaction,
    })
} catch (e) {}

declare global {
    export namespace jest {
        interface Matchers<R> {
            toHaveTransaction(cmp: FlatTransactionComparable): R
        }
    }
}