import nmath from '../built-in';
import type { Dict } from '../_internals/types';


export const functions: Dict<(...args: any[]) => number> = Object.freeze({
  sin: nmath.sin,
  cos: nmath.cos,
  tan: nmath.tan,
  atan: nmath.atan,
  asin: nmath.asin,
  acos: nmath.acos,
  abs: nmath.abs,
  sqrt: nmath.sqrt,
  ln: (x: number) => nmath.log(x),
  log: (x: number, base: number = 10) => nmath.log(x) / nmath.log(base),
  log2: nmath.log2,
  log10: nmath.log10,
  exp: nmath.exp,
});

export const supportedFunctions = Object.freeze(Object.keys(functions));


export const constants: Dict<number> = Object.freeze({
  PI: nmath.PI,
  E: nmath.E,
});

export const supportedConstants = Object.freeze(Object.keys(constants));


export function isConstant(arg: string): boolean {
  return arg in constants;
}

export function isFunction(arg: string): boolean {
  return arg in functions;
}
