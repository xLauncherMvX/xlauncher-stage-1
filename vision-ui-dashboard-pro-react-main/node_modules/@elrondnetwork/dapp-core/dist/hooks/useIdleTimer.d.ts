interface IdleTimerType {
    minutes?: number;
    onLogout?: (props?: any) => void;
}
export declare const useIdleTimer: ({ minutes, onLogout }: IdleTimerType) => void;
export default useIdleTimer;
