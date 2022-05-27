import { Transaction } from '@elrondnetwork/erdjs';
export declare const useSignTransactions: () => {
    error: string | null;
    onAbort: (sessionId?: string | undefined) => void;
    hasTransactions: boolean;
    callbackRoute: string;
    sessionId: string | undefined;
    transactions: Transaction[] | undefined;
};
export default useSignTransactions;
