import { SendTransactionsPropsType } from 'types';
export interface SendTransactionReturnType {
    error?: string;
    sessionId: string | null;
}
export declare function sendTransactions({ transactions, transactionsDisplayInfo, redirectAfterSign, callbackRoute, signWithoutSending, completedTransactionsDelay, sessionInformation, minGasLimit }: SendTransactionsPropsType): Promise<SendTransactionReturnType>;
export default sendTransactions;
