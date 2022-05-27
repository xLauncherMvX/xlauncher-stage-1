import { RootState } from '../store';
export declare const transactionsInfoSelectors: (state: RootState) => import("../slices").StateType;
export declare const transactionDisplayInfoSelector: import("reselect").OutputParametricSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, string | null, any, (res1: import("../slices").StateType, res2: string | null) => any>;
