export type ComparatorCallbackFn = ((arg_0: string | number, arg_1: string | number) => -1 | 0 | 1);


export class Comparator {
  #callback: ComparatorCallbackFn;

  constructor(callback?: ComparatorCallbackFn) {
    this.#callback = callback || Comparator.#defaultCallback;
  }

  static #defaultCallback(a: number | string, b: number | string) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }

  public equal(a: number | string, b: number | string): boolean {
    return this.#callback(a, b) === 0;
  }

  public lessThan(a: number | string, b: number | string): boolean {
    return this.#callback(a, b) < 0;
  }

  public greaterThan(a: number | string, b: number | string): boolean {
    return this.#callback(a, b) > 0;
  }

  public lessThanOrEqual(a: number | string, b: number | string): boolean {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  public greaterThanOrEqual(a: number | string, b: number | string): boolean {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  public reverse(): this {
    const original = this.#callback;
    this.#callback = (a, b) => original(b, a);
    return this;
  }

  public isBetween(value: number | string, min: number | string, max: number | string, include: boolean = false): boolean {
    if (!max || (typeof max !== 'number' && typeof max !== 'string')) {
      max = min;
      min = 0;
    }

    if (this[include === true ? 'greaterThanOrEqual' : 'greaterThan'](value, min) && this[include === true ? 'lessThanOrEqual' : 'lessThan'](value, max)) return true;
    return false;
  }
}

export default Comparator;
