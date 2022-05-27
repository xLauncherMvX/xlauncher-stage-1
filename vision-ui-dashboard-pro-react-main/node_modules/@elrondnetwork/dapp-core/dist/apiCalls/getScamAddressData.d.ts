export declare type ScamInfoType = {
    scamInfo?: {
        type: string;
        info: string;
    };
    code: string;
};
export declare function getScamAddressData(addressToVerify: string): Promise<ScamInfoType>;
export default getScamAddressData;
