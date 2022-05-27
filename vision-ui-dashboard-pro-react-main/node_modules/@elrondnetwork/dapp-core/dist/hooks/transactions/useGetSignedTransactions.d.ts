import { SignedTransactionsType, SignedTransactionsBodyType } from 'types/transactions';
interface useGetSignedTransactionsReturnType {
    signedTransactions: SignedTransactionsType;
    signedTransactionsArray: [string, SignedTransactionsBodyType][];
    hasSignedTransactions: boolean;
}
export declare function useGetSignedTransactions(): useGetSignedTransactionsReturnType;
export {};
