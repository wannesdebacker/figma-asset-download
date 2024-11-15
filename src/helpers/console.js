import chalk from "chalk";

const { blue, green } = chalk;

export const log = (...args) => console.log(green(...args));
export const time = (...args) => console.time(blue(...args));
export const timeEnd = (...args) => console.timeEnd(blue(...args));
