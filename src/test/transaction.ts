import { AccountStatus, Address, Cell, Transaction } from "ton-core";
import { inspect } from "node-inspect-extracted";
import { CompareResult } from "./interface";

export type FlatTransaction = {
    from?: Address
    to: Address
    on: Address
    value?: bigint
    body: Cell
    inMessageBounced?: boolean
    inMessageBounceable?: boolean
    op?: number
    initData?: Cell
    initCode?: Cell
    deploy: boolean
    lt: bigint
    now: number
    outMessagesCount: number
    oldStatus: AccountStatus
    endStatus: AccountStatus
    totalFees?: bigint
    aborted?: boolean
    destroyed?: boolean
    exitCode?: number
    actionResultCode?: number
    success?: boolean
}

type WithFunctions<T> = {
    [K in keyof T]: T[K] | ((x: T[K]) => boolean)
}

export type FlatTransactionComparable = Partial<WithFunctions<FlatTransaction>>

function extractOp(body: Cell): number | undefined {
    const s = body.beginParse()
    if (s.remainingBits >= 32) {
        return s.loadUint(32)
    } else {
        return undefined
    }
}

export function flattenTransaction(tx: Transaction): FlatTransaction {
    return {
        from: tx.inMessage!.info.src instanceof Address ? tx.inMessage!.info.src : undefined,
        to: tx.inMessage!.info.dest as Address,
        on: tx.inMessage!.info.dest as Address,
        value: tx.inMessage!.info.type === 'internal' ? tx.inMessage!.info.value.coins : undefined,
        body: tx.inMessage!.body,
        inMessageBounced: tx.inMessage!.info.type === 'internal' ? tx.inMessage!.info.bounced : undefined,
        inMessageBounceable: tx.inMessage!.info.type === 'internal' ? tx.inMessage!.info.bounce : undefined,
        op: extractOp(tx.inMessage!.body),
        initData: tx.inMessage!.init?.data ?? undefined,
        initCode: tx.inMessage!.init?.code ?? undefined,
        deploy: !!tx.inMessage!.init && tx.oldStatus !== 'active' && tx.endStatus === 'active',
        lt: tx.lt,
        now: tx.now,
        outMessagesCount: tx.outMessagesCount,
        oldStatus: tx.oldStatus,
        endStatus: tx.endStatus,
        totalFees: tx.totalFees.coins,
        ...(tx.description.type === 'generic' ? {
            aborted: tx.description.aborted,
            destroyed: tx.description.destroyed,
            exitCode: tx.description.computePhase.type === 'vm' ? tx.description.computePhase.exitCode : undefined,
            actionResultCode: tx.description.actionPhase?.resultCode,
            success: tx.description.computePhase.type === 'vm'
                ? (tx.description.computePhase.success && tx.description.actionPhase?.success)
                : false,
        } : {
            aborted: undefined,
            destroyed: undefined,
            exitCode: undefined,
            actionResultCode: undefined,
            success: undefined,
        }),
    }
}

function compareValue(a: any, b: any) {
    if (a instanceof Address) {
        if (!(b instanceof Address)) return false
        return a.equals(b)
    }

    if (a instanceof Cell) {
        if (!(b instanceof Cell)) return false
        return a.equals(b)
    }

    return a === b
}

export function compareTransaction(tx: FlatTransaction, cmp: FlatTransactionComparable): boolean {
    for (const key in cmp) {
        if (!(key in tx)) throw new Error(`Unknown flat transaction object key ${key}`)

        const cmpv = (cmp as any)[key]
        const txv = (tx as any)[key]
        if (typeof cmpv === 'function') {
            if (!cmpv(txv)) return false
        } else {
            if (!compareValue(txv, cmpv)) return false
        }
    }

    return true
}

export function compareTransactionForTest(subject: any, cmp: FlatTransactionComparable): CompareResult {
    if (Array.isArray(subject)) {
        const arr = (subject as Transaction[]).filter(tx => tx.description.type === 'generic').map(tx => flattenTransaction(tx))
        return {
            pass: arr.some(ftx => compareTransaction(ftx, cmp)),
            posMessage: ((arr: any, cmp: FlatTransactionComparable) => `Expected ${inspect(arr)} to contain a transaction that matches pattern ${inspect(cmp)}`).bind(undefined, arr, cmp),
            negMessage: ((arr: any, cmp: FlatTransactionComparable) => `Expected ${inspect(arr)} NOT to contain a transaction that matches pattern ${inspect(cmp)}, but it does`).bind(undefined, arr, cmp),
        }
    } else {
        try {
            if ((subject as Transaction).description.type !== 'generic') {
                throw new Error('Transaction matching can only be done on generic transactions')
            }
            const flat = flattenTransaction(subject)
            return {
                pass: compareTransaction(flat, cmp),
                posMessage: ((flat: any, cmp: FlatTransactionComparable) => `Expected ${inspect(flat)} to match pattern ${inspect(cmp)}`).bind(undefined, flat, cmp),
                negMessage: ((flat: any, cmp: FlatTransactionComparable) => `Expected ${inspect(flat)} NOT to match pattern ${inspect(cmp)}, but it does`).bind(undefined, flat, cmp),
            }
        } catch (e) {
            if (subject.transactions !== undefined) {
                console.warn('It seems that a SendMessageResult is being used for this comparison. Please make sure to pass `result.transactions` instead of just `result` into the matcher.');
            }
            throw e;
        }
    }
}