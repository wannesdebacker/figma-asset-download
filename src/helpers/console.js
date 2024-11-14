import chalk from "chalk";

const { blue, green, red, yellow } = chalk;

export const log = (...args) => console.log(green(...args));
export const error = (...args) => console.error(red(...args));
export const warn = (...args) => console.warn("⚠️", yellow(...args));
export const debug = (...args) => console.debug(blue(...args));
export const time = (...args) => console.time(blue(...args));
export const timeEnd = (...args) => console.timeEnd(blue(...args));
export const table = (...args) => console.table(blue(...args));
