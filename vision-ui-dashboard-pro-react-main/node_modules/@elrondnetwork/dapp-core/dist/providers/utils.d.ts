import { HWProvider, IDappProvider, SignableMessage, Transaction, WalletProvider } from '@elrondnetwork/erdjs';
import { LoginMethodsEnum } from 'types/enums';
export declare const DAPP_INIT_ROUTE = "/dapp/init";
export declare const getProviderType: (provider?: IDappProvider | null | undefined) => LoginMethodsEnum;
export declare const newWalletProvider: (walletAddress: string) => WalletProvider;
export declare const getLedgerConfiguration: (initializedHwWalletP: HWProvider) => Promise<{
    version: string;
    dataEnabled: boolean;
}>;
export declare class EmptyProvider implements IDappProvider {
    init(): Promise<boolean>;
    login(options?: {
        callbackUrl?: string;
        token?: string;
    }): Promise<string>;
    logout(options?: {
        callbackUrl?: string;
    }): Promise<boolean>;
    getAddress(): Promise<string>;
    isInitialized(): boolean;
    isConnected(): Promise<boolean>;
    sendTransaction(transaction: Transaction, options?: {
        callbackUrl?: string;
    }): Promise<Transaction>;
    signTransaction(transaction: Transaction, options?: {
        callbackUrl?: string;
    }): Promise<Transaction>;
    signTransactions(transactions: Transaction[], options?: {
        callbackUrl?: string;
    }): Promise<Transaction[]>;
    signMessage(message: SignableMessage): Promise<SignableMessage>;
}
export declare const emptyProvider: EmptyProvider;
