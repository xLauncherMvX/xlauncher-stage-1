import { SignableMessage } from '@elrondnetwork/erdjs';
interface SignMessageType {
    message: string;
    callbackRoute?: string;
}
export declare function signMessage({ message, callbackRoute }: SignMessageType): Promise<SignableMessage>;
export default signMessage;
