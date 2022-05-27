/// <reference types="react" />
import { CustomNetworkType, EnvironmentsEnum } from 'types';
interface AppInitializerPropsType {
    customNetworkConfig?: CustomNetworkType;
    children: any;
    environment: EnvironmentsEnum;
}
export declare function AppInitializer({ customNetworkConfig, children, environment }: AppInitializerPropsType): JSX.Element | null;
export default AppInitializer;
