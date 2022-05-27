import React from 'react';
import { ActiveLedgerTransactionType, MultiSignTxType } from 'types';
export interface SignStepType {
    onSignTransaction: () => void;
    onPrev: () => void;
    handleClose: () => void;
    waitingForDevice: boolean;
    error: string | null;
    callbackRoute?: string;
    title?: React.ReactNode;
    currentStep: number;
    currentTransaction: ActiveLedgerTransactionType | null;
    allTransactions: MultiSignTxType[];
    isLastTransaction: boolean;
    className: string;
}
declare const SignStep: ({ onSignTransaction, handleClose, onPrev, title, waitingForDevice, currentTransaction, error, allTransactions, isLastTransaction, currentStep, className }: SignStepType) => JSX.Element | null;
export default SignStep;
