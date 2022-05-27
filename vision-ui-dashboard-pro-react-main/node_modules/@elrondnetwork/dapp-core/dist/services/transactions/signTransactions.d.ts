import { SignTransactionsPropsType } from 'types';
import { SendTransactionReturnType } from './sendTransactions';
export declare function signTransactions({ transactions, callbackRoute, minGasLimit, customTransactionInformation, transactionsDisplayInfo }: SignTransactionsPropsType): SendTransactionReturnType;
export default signTransactions;
