import { ProxyProvider } from '@elrondnetwork/erdjs';
import { NetworkType } from 'types';
export declare function initializeProxyProvider(networkConfig?: NetworkType): ProxyProvider;
export declare function getProxyProvider(): ProxyProvider;
export declare function getAccountFromProxyProvider(address?: string): Promise<import("@elrondnetwork/erdjs/out").AccountOnNetwork | null>;
export declare function getNetworkConfigFromProxyProvider(): Promise<import("@elrondnetwork/erdjs/out").NetworkConfig | null>;
