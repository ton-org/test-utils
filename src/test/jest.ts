import { FlatTransactionComparable, compareTransactionForTest } from "./transaction";
import type { MatcherFunction } from "expect";
import { CompareResult } from "./interface";

function wrapComparer<T>(comparer: (subject: any, cmp: T) => CompareResult): MatcherFunction<[cmp: T]> {
    return function(actual, cmp) {
        const result = comparer(actual, cmp)
        return {
            pass: result.pass,
            message: () => {
                if (result.pass) {
                    return result.negMessage()
                } else {
                    return result.posMessage()
                }
            },
        }
    }
}

const toHaveTransaction = wrapComparer(compareTransactionForTest)

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