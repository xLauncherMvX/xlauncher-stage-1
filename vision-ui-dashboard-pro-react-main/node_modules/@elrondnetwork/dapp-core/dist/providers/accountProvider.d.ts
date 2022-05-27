import { IDappProvider } from '@elrondnetwork/erdjs';
export declare function setAccountProvider(provider: IDappProvider): void;
export declare function setExternalProvider(provider: IDappProvider): void;
export declare function setExternalProviderAsAccountProvider(): void;
export declare function getAccountProvider(): IDappProvider;
export declare function getExternalProvider(): IDappProvider | null;
