/// <reference types="react" />
interface ProgressStepsType {
    totalSteps: number;
    currentStep: number;
    className?: string;
}
declare const ProgressSteps: ({ totalSteps, currentStep, className }: ProgressStepsType) => JSX.Element;
export default ProgressSteps;
