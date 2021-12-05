import BigNumber from "bignumber.js";

export function removeSpace(text: string) {
    return text.replace(" ", "");
}
  
export function ellipseAddress(address = "", width = 6): string {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function microAlgosToAlgos(microAlgos) {
    return Number.isSafeInteger(microAlgos) ? 
        microAlgos/1e6
        : new BigNumber(microAlgos).dividedBy(1e6).toNumber();
}

export const currencyFormatter = new Intl.NumberFormat('en-US');

export const integerFormatter = new Intl.NumberFormat('en-US');
