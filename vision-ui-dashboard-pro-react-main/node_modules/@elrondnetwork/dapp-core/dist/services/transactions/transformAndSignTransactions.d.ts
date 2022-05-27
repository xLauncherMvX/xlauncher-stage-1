import { Transaction } from '@elrondnetwork/erdjs';
import { SendSimpleTransactionPropsType } from 'types';
export declare function transformAndSignTransactions({ transactions }: SendSimpleTransactionPropsType): Promise<Transaction[]>;
export default transformAndSignTransactions;
