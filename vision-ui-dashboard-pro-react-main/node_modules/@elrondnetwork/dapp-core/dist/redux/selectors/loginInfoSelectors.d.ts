import { LoginMethodsEnum } from 'types/enums';
import { RootState } from '../store';
export declare const loginInfoSelector: (state: RootState) => import("../slices").LoginInfoStateType;
export declare const loginMethodSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, LoginMethodsEnum, (res: import("../slices").LoginInfoStateType) => LoginMethodsEnum>;
export declare const isLoggedInSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, boolean, (res1: import("../slices").LoginInfoStateType, res2: string) => boolean>;
export declare const walletConnectLoginSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, import("../slices").WalletConnectLoginType | null, (res: import("../slices").LoginInfoStateType) => import("../slices").WalletConnectLoginType | null>;
export declare const ledgerLoginSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, import("../slices").LedgerLoginType | null, (res: import("../slices").LoginInfoStateType) => import("../slices").LedgerLoginType | null>;
export declare const walletLoginSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, import("../slices").LoginInfoType | null, (res: import("../slices").LoginInfoStateType) => import("../slices").LoginInfoType | null>;
