import { RootState } from '../store';
export declare const accountInfoSelector: (state: RootState) => import("../slices").AccountInfoSliceType;
export declare const addressSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, string, (res: import("../slices").AccountInfoSliceType) => string>;
export declare const accountSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, import("../slices").AccountType, (res: import("../slices").AccountInfoSliceType) => import("../slices").AccountType>;
export declare const accountBalanceSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, string, (res: import("../slices").AccountType) => string>;
export declare const accountNonceSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, number, (res: import("../slices").AccountType) => number>;
export declare const shardSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, number | undefined, (res: import("../slices").AccountInfoSliceType) => number | undefined>;
export declare const ledgerAccountSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, import("../slices").LedgerAccountType | null, (res: import("../slices").AccountInfoSliceType) => import("../slices").LedgerAccountType | null>;
export declare const walletConnectAccountSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, string | null, (res: import("../slices").AccountInfoSliceType) => string | null>;
export declare const isAccountLoadingSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, boolean, (res: import("../slices").AccountInfoSliceType) => boolean>;
export declare const isAccountLoadingErrorSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, string | null, (res: import("../slices").AccountInfoSliceType) => string | null>;
