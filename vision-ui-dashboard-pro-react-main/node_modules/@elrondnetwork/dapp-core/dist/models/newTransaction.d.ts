import { Transaction } from '@elrondnetwork/erdjs';
import { RawTransactionType } from 'types/transactions';
export declare function newTransaction(rawTransaction: RawTransactionType): Transaction;
export default newTransaction;
