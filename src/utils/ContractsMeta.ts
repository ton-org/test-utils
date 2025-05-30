import { Address, ContractABI } from "@ton/core";

export type ContractMeta = {
    wrapperName?: string;
    abi?: ContractABI | null;
    treasurySeed?: string;
}

export class ContractsMeta {
    protected contractsMeta = new Map<string, ContractMeta>();

    private addressToKey(address: Address) {
        return address.toString();
    }

    get(key: Address) {
        return this.contractsMeta.get(this.addressToKey(key));
    }

    upsert(key: Address, value: Partial<ContractMeta>) {
        const oldValue = this.contractsMeta.get(this.addressToKey(key));
        this.contractsMeta.set(this.addressToKey(key), {...(oldValue ?? {}), ...value});
    }

    clear() {
        this.contractsMeta.clear();
    }

    delete(key: Address) {
        this.contractsMeta.delete(this.addressToKey(key));
    }
}

export const contractsMeta = new ContractsMeta();