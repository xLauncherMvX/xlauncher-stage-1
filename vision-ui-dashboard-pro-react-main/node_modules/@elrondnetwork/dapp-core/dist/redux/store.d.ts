/// <reference types="redux-persist/types/types" />
/// <reference types="redux-persist" />
export declare const store: import("@reduxjs/toolkit").EnhancedStore<any, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<any>>;
export declare const persistor: import("redux-persist").Persistor;
declare const storeType: import("@reduxjs/toolkit").EnhancedStore<import("redux").CombinedState<{
    account: import("./slices").AccountInfoSliceType;
    networkConfig: import("./slices").NetworkConfigStateType;
    loginInfo: import("./slices").LoginInfoStateType;
    modals: import("./slices").ModalsSliceState;
    transactions: import("./slices").TransactionsSliceStateType;
    transactionsInfo: import("./slices").StateType;
}>, import("redux").AnyAction, [import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    account: import("./slices").AccountInfoSliceType;
    networkConfig: import("./slices").NetworkConfigStateType;
    loginInfo: import("./slices").LoginInfoStateType;
    modals: import("./slices").ModalsSliceState;
    transactions: import("./slices").TransactionsSliceStateType;
    transactionsInfo: import("./slices").StateType;
}>, import("redux").AnyAction, null> | import("redux-thunk").ThunkMiddleware<import("redux").CombinedState<{
    account: import("./slices").AccountInfoSliceType;
    networkConfig: import("./slices").NetworkConfigStateType;
    loginInfo: import("./slices").LoginInfoStateType;
    modals: import("./slices").ModalsSliceState;
    transactions: import("./slices").TransactionsSliceStateType;
    transactionsInfo: import("./slices").StateType;
}>, import("redux").AnyAction, undefined>]>;
export declare type StoreType = typeof storeType;
export declare type RootState = ReturnType<typeof storeType.getState>;
export declare type AppDispatch = typeof store.dispatch;
export {};
