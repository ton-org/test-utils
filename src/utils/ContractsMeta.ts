import { Address, ContractABI } from "@ton/core";

export type ContractMeta = {
    wrapperName?: string;
    abi?: ContractABI | null;
    treasurySeed?: string;
}

export class ContractsMeta {
    protected contractsMeta = new Map<string, ContractMeta>();

    get(key: Address) {
        return this.contractsMeta.get(key.toString());
    }

    upsert(key: Address, value: Partial<ContractMeta>) {
        const oldValue = this.contractsMeta.get(key.toString());
        this.contractsMeta.set(key.toString(), {...(oldValue ?? {}), ...value});
    }
}

export const contractsMeta = new ContractsMeta();