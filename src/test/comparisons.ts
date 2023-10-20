import { Address, Cell, Slice, Transaction } from "@ton/core";
import { CompareResult } from "./interface";

export function compareCellForTest(subject: any, cmp: Cell): CompareResult {
    return {
        pass: cmp.equals(subject),
        posMessage: ((subject: any, cmp: Cell) => `Expected\n${subject}\nto equal\n${cmp}`).bind(undefined, subject, cmp),
        negMessage: ((subject: any, cmp: Cell) => `Expected\n${subject}\nNOT to equal\n${cmp}\nbut it does`).bind(undefined, subject, cmp),
    }
}

export function compareAddressForTest(subject: any, cmp: Address): CompareResult {
    return {
        pass: cmp.equals(subject),
        posMessage: ((subject: any, cmp: Address) => `Expected ${subject} to equal ${cmp}`).bind(undefined, subject, cmp),
        negMessage: ((subject: any, cmp: Address) => `Expected ${subject} NOT to equal ${cmp}, but it does`).bind(undefined, subject, cmp),
    }
}

export function compareSliceForTest(subject: any, cmp: Slice): CompareResult {
    return {
        pass: cmp.asCell().equals(subject.asCell()),
        posMessage: ((subject: any, cmp: Slice) => `Expected\n${subject}\nto equal\n${cmp}`).bind(undefined, subject, cmp),
        negMessage: ((subject: any, cmp: Slice) => `Expected\n${subject}\nNOT to equal\n${cmp}\nbut it does`).bind(undefined, subject, cmp),
    }
}


export function gasUsage(messageResult: any): bigint {
    try {
        const transactions = Array.isArray(messageResult?.transactions) ? messageResult.transactions : (Array.isArray(messageResult) ? messageResult : [messageResult]);
        return transactions.reduce((gas: bigint, tx: Transaction) => {
            return gas + tx.totalFees.coins;
        }, 0n)
    } catch (e) {
        throw new Error("Compared object is not SendMessageResult nor transaction(s)");
    }
}

export function gasCompare(messageResult: any, toCompare: bigint, accuracy: bigint = 2n): [bigint, boolean] {
    const gas = gasUsage(messageResult);
    if (gas >= toCompare - accuracy) {
        if (gas <= toCompare + accuracy) {
            return [gas, true];
        }
    }
    return [gas, false];
}
export function gasUsageForTest(subject: any, cmp: bigint, accuracy: bigint = 2n): CompareResult {
    const [gas, pass] = gasCompare(subject, cmp, accuracy);
    return {
        pass,
        posMessage: ((subject: any, cmp: bigint, accuracy?: bigint) => `Expected ${gas} to equal ${cmp}${accuracy === 0n ? '' : `±${accuracy}`}`).bind(undefined, subject, cmp, accuracy),
        negMessage: ((subject: any, cmp: bigint, accuracy?: bigint) => `Expected ${gas} NOT to equal ${cmp}${accuracy === 0n ? '' : `±${accuracy}`} but it does`).bind(undefined, subject, cmp, accuracy),
    }
}
