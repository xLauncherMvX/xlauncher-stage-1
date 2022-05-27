import { EnvironmentsEnum, NetworkType } from 'types';
export declare const DEFAULT_MIN_GAS_LIMIT = 50000;
export declare const configEndpoint = "dapp/config";
export declare const fallbackNetworkConfigurations: Record<keyof typeof EnvironmentsEnum, NetworkType>;
