import { RootState } from '../store';
export declare const modalsSliceSelector: (state: RootState) => import("../slices").ModalsSliceState;
export declare const txSubmittedModalSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, import("../slices").TxSubmittedModal | undefined, (res: import("../slices").ModalsSliceState) => import("../slices").TxSubmittedModal | undefined>;
export declare const notificationModalSelector: import("reselect").OutputSelector<import("redux").CombinedState<{
    account: import("../slices").AccountInfoSliceType;
    networkConfig: import("../slices").NetworkConfigStateType;
    loginInfo: import("../slices").LoginInfoStateType;
    modals: import("../slices").ModalsSliceState;
    transactions: import("../slices").TransactionsSliceStateType;
    transactionsInfo: import("../slices").StateType;
}>, import("../slices").NotificationModal | undefined, (res: import("../slices").ModalsSliceState) => import("../slices").NotificationModal | undefined>;
