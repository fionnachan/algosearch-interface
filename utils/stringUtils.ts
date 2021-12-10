import BigNumber from "bignumber.js";

export function removeSpace(text: string) {
    return text.replace(" ", "");
}
  
export function ellipseAddress(address = "", width = 6): string {
    return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function microAlgosToAlgos(microAlgos) {
    return Number.isSafeInteger(microAlgos) ? 
        (microAlgos/1e6).toFixed(2)
        : new BigNumber(microAlgos).dividedBy(1e6).toNumber();
}

export function timeAgoLocale(diff: number, index: number, totalSec: number): [string, string] {
    // diff: the time ago / time in number;
    // index: the index of array below;
    // totalSec: total seconds between date to be formatted and today's date;
    return [
      ['just now', 'right now'],
      ['%s secs ago', 'in %s secs'],
      ['1 min ago', 'in 1 min'],
      ['%s mins ago', 'in %s mins'],
      ['1 hour ago', 'in 1 hour'],
      ['%s hours ago', 'in %s hours'],
      ['1 day ago', 'in 1 day'],
      ['%s days ago', 'in %s days'],
      ['1 week ago', 'in 1 week'],
      ['%s weeks ago', 'in %s weeks'],
      ['1 month ago', 'in 1 month'],
      ['%s months ago', 'in %s months'],
      ['1 year ago', 'in 1 year'],
      ['%s years ago', 'in %s years']
    ][index] as [string, string];
};

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2
});

export const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2
});
