export declare const useGetLoginInfo: () => {
    isLoggedIn: boolean;
    loginMethod: import("../..").LoginMethodsEnum;
    walletConnectLogin: import("../../redux/slices").WalletConnectLoginType | null;
    ledgerLogin: import("../../redux/slices").LedgerLoginType | null;
    tokenLogin: import("../..").TokenLoginType | null;
    walletLogin: import("../../redux/slices").LoginInfoType | null;
    extensionLogin: import("../../redux/slices").LoginInfoType | null;
};
export default useGetLoginInfo;
