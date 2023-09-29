import { Transaction } from "@ton/core";
import { FlatTransactionComparable, flattenTransaction, compareTransaction } from "../test/transaction";
import { inspect } from "node-inspect-extracted";

export const executeTill = async <T extends Transaction>(txs: AsyncIterator<T>, match: FlatTransactionComparable) => {
    let executed: T[] = []
    let iterResult = await txs.next()
    let found = false
    while(!iterResult.done){
        executed.push(iterResult.value);
        found = compareTransaction(flattenTransaction(iterResult.value), match);
        if(found) {
            break
        }
        iterResult = await txs.next()
    }
    if(!found) {
        throw(Error(`Expected ${inspect(executed.map(x => flattenTransaction(x)))} to contain a transaction that matches pattern ${inspect(match)}`))
    }

    return executed
}

export const executeFrom = async <T extends Transaction>(txs: AsyncIterator<T>) => {
    let executed: T[] = []
    let iterResult = await txs.next()

    while(!iterResult.done) {
        executed.push(iterResult.value)
        iterResult = await txs.next()
    }

    return executed
}
