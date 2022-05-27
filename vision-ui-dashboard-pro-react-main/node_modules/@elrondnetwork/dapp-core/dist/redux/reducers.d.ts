declare const rootReducer: import("redux").Reducer<import("redux").CombinedState<{
    account: import("./slices/accountInfoSlice").AccountInfoSliceType;
    networkConfig: import("./slices/networkConfigSlice").NetworkConfigStateType;
    loginInfo: import("./slices/loginInfoSlice").LoginInfoStateType;
    modals: import("./slices/modalsSlice").ModalsSliceState;
    transactions: import("./slices/transactionsSlice").TransactionsSliceStateType;
    transactionsInfo: import("./slices/transactionsInfoSlice").StateType;
}>, import("redux").AnyAction>;
export default rootReducer;
