import { Address, Cell, Slice } from '@ton/core';

import { CompareResult } from './interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareCellForTest(subject: any, cmp: Cell): CompareResult {
    return {
        pass: cmp.equals(subject),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posMessage: ((subject: any, cmp: Cell) => `Expected\n${subject}\nto equal\n${cmp}`).bind(
            undefined,
            subject,
            cmp,
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        negMessage: ((subject: any, cmp: Cell) => `Expected\n${subject}\nNOT to equal\n${cmp}\nbut it does`).bind(
            undefined,
            subject,
            cmp,
        ),
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareAddressForTest(subject: any, cmp: Address): CompareResult {
    return {
        pass: cmp.equals(subject),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posMessage: ((subject: any, cmp: Address) => `Expected ${subject} to equal ${cmp}`).bind(
            undefined,
            subject,
            cmp,
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        negMessage: ((subject: any, cmp: Address) => `Expected ${subject} NOT to equal ${cmp}, but it does`).bind(
            undefined,
            subject,
            cmp,
        ),
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compareSliceForTest(subject: any, cmp: Slice): CompareResult {
    return {
        pass: cmp.asCell().equals(subject.asCell()),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posMessage: ((subject: any, cmp: Slice) => `Expected\n${subject}\nto equal\n${cmp}`).bind(
            undefined,
            subject,
            cmp,
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        negMessage: ((subject: any, cmp: Slice) => `Expected\n${subject}\nNOT to equal\n${cmp}\nbut it does`).bind(
            undefined,
            subject,
            cmp,
        ),
    };
}
