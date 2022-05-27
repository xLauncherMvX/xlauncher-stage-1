import { Balance } from '@elrondnetwork/erdjs';
export declare function denominate({ input, denomination, decimals, showLastNonZeroDecimal, showIsLessThanDecimalsLabel, addCommas }: {
    input: string | Balance;
    denomination?: number;
    decimals?: number;
    showIsLessThanDecimalsLabel?: boolean;
    showLastNonZeroDecimal?: boolean;
    addCommas?: boolean;
}): string;
export default denominate;
