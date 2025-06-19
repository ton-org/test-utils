import { Address } from '@ton/core';

import errors from '../errors.json';
import { ExtendedTransaction, flattenTransaction, FlatTransaction } from '../test/transaction';
import { contractsMeta } from './ContractsMeta';

type PrettifiedProps = {
    failReason?: FailReason;
    from?: string;
    to?: string;
    on?: string;
    op?: string;
};

export type PrettyTransaction = Omit<FlatTransaction, keyof PrettifiedProps> & PrettifiedProps;

export type FailReason = {
    message: string;
};

const typedErrors: Record<string, FailReason> = errors;

function extractError(tx: FlatTransaction, errors: Record<string, FailReason> | undefined | null) {
    return errors?.[String(tx.exitCode)] ?? errors?.[String(tx.actionResultCode)];
}

export function extractFailReason(tx: FlatTransaction): FailReason | undefined {
    if (tx.success) {
        return undefined;
    }

    const destination = tx.to;
    if (!destination) {
        return extractError(tx, typedErrors);
    }

    const meta = contractsMeta.get(destination);
    return extractError(tx, meta?.abi?.errors) ?? extractError(tx, typedErrors);
}

function prettifyOpcode(address: Address | undefined, op: number | undefined): string | undefined {
    if (!address || op === undefined) {
        return op?.toString();
    }

    const meta = contractsMeta.get(address);
    if (!meta?.abi?.types) {
        return op.toString();
    }

    const methodType = meta.abi.types.find((type) => type.header === op);

    let label = op.toString();
    if (methodType) {
        label += ` (${methodType.name})`;
    }

    return label;
}

function prettifyAddress(address: Address | undefined): string | undefined {
    if (!address) {
        return undefined;
    }

    const meta = contractsMeta.get(address);
    if (!meta) {
        return address.toString();
    }

    let contractLabel = meta.abi?.name ?? meta.wrapperName;
    if (meta.treasurySeed) {
        contractLabel = contractLabel === undefined ? meta.treasurySeed : `${contractLabel}-${meta.treasurySeed}`;
    }

    if (contractLabel === undefined) {
        return address.toString();
    }

    return `${address.toString()} (${contractLabel})`;
}

export function prettifyTransaction(tx: ExtendedTransaction): PrettyTransaction {
    const flatTx = flattenTransaction(tx);
    return {
        ...flatTx,
        failReason: extractFailReason(flatTx),
        to: prettifyAddress(flatTx.to),
        from: prettifyAddress(flatTx.from),
        on: prettifyAddress(flatTx.on),
        op: prettifyOpcode(flatTx.to, flatTx.op),
    };
}
