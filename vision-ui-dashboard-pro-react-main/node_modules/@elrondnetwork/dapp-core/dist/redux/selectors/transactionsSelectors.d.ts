import { Transaction } from '@elrondnetwork/erdjs';
import { CustomTransactionInformation, SignedTransactionsType } from 'types/transactions';
import { RootState } from '../store';
export interface TransactionsToSignReturnType {
    callbackRoute?: string;
    sessionId: string;
    transactions: Transaction[];
    customTransactionInformation: CustomTransactionInformation;
}
export declare const transactionsSelectors: (state: RootState) => import("../slices").TransactionsSliceStateType;
export declare const signedTransactionsSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, SignedTransactionsType, (res: import("../slices").TransactionsSliceStateType) => SignedTransactionsType>;
export declare const signTransactionsErrorSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, string | null, (res: import("../slices").TransactionsSliceStateType) => string | null>;
export declare const pendingSignedTransactionsSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, SignedTransactionsType, (res: SignedTransactionsType) => SignedTransactionsType>;
export declare const successfulTransactionsSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, SignedTransactionsType, (res: SignedTransactionsType) => SignedTransactionsType>;
export declare const completedTransactionsSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, SignedTransactionsType, (res: SignedTransactionsType) => SignedTransactionsType>;
export declare const failedTransactionsSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, SignedTransactionsType, (res: SignedTransactionsType) => SignedTransactionsType>;
export declare const timedOutTransactionsSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, SignedTransactionsType, (res: SignedTransactionsType) => SignedTransactionsType>;
export declare const transactionsToSignSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, TransactionsToSignReturnType | null, (res: import("../slices").TransactionsSliceStateType) => TransactionsToSignReturnType | null>;
export declare const transactionStatusSelector: import("reselect").OutputParametricSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, string | null, import("../../types/transactions").SignedTransactionsBodyType, (res1: SignedTransactionsType, res2: string | null) => import("../../types/transactions").SignedTransactionsBodyType>;
