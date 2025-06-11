import { Cell, Transaction, loadTransaction, Address } from '@ton/core';

import { prettifyTransaction } from './pretty-transaction';
import { contractsMeta } from './ContractsMeta';

// https://tonviewer.com/transaction/5bf72c6176c05c67fea19c19fcd47fc5f0dd3a1ca5751301f527862d19c40b50
const cell = Cell.fromBase64(
    'te6ccgECBgEAAWQAA7VyTjRpWA16dAJzYea7IhARrTnqTZMZDClCQpsTvWOFkSAAAjlKRSd8d1VJdrlojk2tE0R2YQzVvQihpkrNfVlosaesSdlZktYQAAI5SkUnfDZKlnhgABRgeB4IAQIDAQGgBACCcoz83Ab0pEynw7l3wfGY+ufntTEboif8NKACRYJb/SHmmwB2a/lFtZyR0Folzo0LLXFxZ4ff9eQaW9OnCDgJyKsBEwwIwPA8EGB4HgkFALdYADAPZs5wp02y/Tb2CIF+2bbawObquu469MFdcHDQ+5nHAAk40aVgNenQCc2HmuyIQEa056k2TGQwpQkKbE71jhZEjA8DwAYUWGAAAEcpSKTvjMlSzwx/////wACgPsfYAf///+UAAAD4AAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
);

const tx: Transaction = loadTransaction(cell.asSlice());

describe('pretty transaction', () => {
    it('no pretty', () => {
        const { failReason, to, on, op } = prettifyTransaction(tx);
        expect({
            failReason,
            to,
            on,
            op,
        }).toEqual({
            on: 'EQAk40aVgNenQCc2HmuyIQEa056k2TGQwpQkKbE71jhZEo2Y',
            op: '4294967295',
            to: 'EQAk40aVgNenQCc2HmuyIQEa056k2TGQwpQkKbE71jhZEo2Y',
        });
    });

    it('pretty', () => {
        contractsMeta.upsert(Address.parse('EQAk40aVgNenQCc2HmuyIQEa056k2TGQwpQkKbE71jhZEo2Y'), {
            wrapperName: 'bar',
            abi: {
                name: 'foo',
                errors: {
                    4294967282: {
                        message: 'some error',
                    },
                },
                types: [
                    {
                        name: 'some',
                        header: 4294967295,
                        fields: [],
                    },
                ],
            },
        });
        const { failReason, to, on, op } = prettifyTransaction(tx);
        expect({
            failReason,
            to,
            on,
            op,
        }).toEqual({
            failReason: {
                message: 'some error',
            },
            to: 'EQAk40aVgNenQCc2HmuyIQEa056k2TGQwpQkKbE71jhZEo2Y (foo)',
            on: 'EQAk40aVgNenQCc2HmuyIQEa056k2TGQwpQkKbE71jhZEo2Y (foo)',
            op: '4294967295 (some)',
        });
    });
});
