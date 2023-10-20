import { FlatTransactionComparable, compareTransactionForTest } from "./transaction";
import type { MatcherFunction } from "expect";
import { CompareResult } from "./interface";
import {
    compareAddressForTest,
    compareCellForTest,
    compareSliceForTest,
    gasUsageForTest
} from "./comparisons";
import { Address, Cell, Slice } from "@ton/core";

function wrapComparer<T>(comparer: (subject: any, cmp: T, ...rest: Array<any>) => CompareResult): MatcherFunction<[cmp: T]> {
    return function(actual, cmp, ...rest) {
        const result = comparer(actual, cmp, ...rest)
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
const toEqualCell = wrapComparer(compareCellForTest)
const toEqualAddress = wrapComparer(compareAddressForTest)
const toEqualSlice = wrapComparer(compareSliceForTest)
const toApproxGasUsage = wrapComparer(gasUsageForTest)

try {
    const jestGlobals = require("@jest/globals");

    if (jestGlobals) jestGlobals.expect.extend({
        toHaveTransaction,
        toEqualCell,
        toEqualAddress,
        toEqualSlice,
        toApproxGasUsage,
    })
} catch (e) {}

declare global {
    export namespace jest {
        interface Matchers<R> {
            toHaveTransaction(cmp: FlatTransactionComparable): R
            toEqualCell(cell: Cell): R
            toEqualAddress(address: Address): R
            toEqualSlice(slice: Slice): R
            toApproxGasUsage(gasUsage: bigint, accuracy?: bigint): R
        }
    }
}
