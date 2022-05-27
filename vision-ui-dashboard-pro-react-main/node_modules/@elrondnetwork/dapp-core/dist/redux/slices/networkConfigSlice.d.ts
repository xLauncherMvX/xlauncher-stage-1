import { PayloadAction } from '@reduxjs/toolkit';
import { AccountInfoSliceNetworkType, NetworkType } from 'types';
export declare const defaultNetwork: AccountInfoSliceNetworkType;
export interface NetworkConfigStateType {
    network: AccountInfoSliceNetworkType;
    chainID: string;
}
export declare const networkConfigSlice: import("@reduxjs/toolkit").Slice<NetworkConfigStateType, {
    initializeNetworkConfig: (state: NetworkConfigStateType, action: PayloadAction<NetworkType>) => void;
    setChainID: (state: NetworkConfigStateType, action: PayloadAction<string>) => void;
}, "appConfig">;
export declare const initializeNetworkConfig: import("@reduxjs/toolkit").ActionCreatorWithPayload<NetworkType, string>, setChainID: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, string>;
declare const _default: import("redux").Reducer<NetworkConfigStateType, import("redux").AnyAction>;
export default _default;
