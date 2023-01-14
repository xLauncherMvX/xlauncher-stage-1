import BigNumber from 'bignumber.js';

export function convertBigNumberToDate(big) {
    return new Date(big.toNumber() * 1000);
}

export const convertWeiToEsdt = (amount, decimals, precision) => {
    if (amount == null) {
        return BigNumber(0);
    } else {
        return BigNumber(amount).shiftedBy(typeof(decimals) !== 'undefined' ? -decimals : -18).decimalPlaces(typeof(precision) !== 'undefined' ? precision : 4, BigNumber.ROUND_DOWN);
    }
};