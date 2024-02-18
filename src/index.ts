export * from './activation';
export * from './comparator';
export * from './built-in';
export * from './random';
export * from './vector';
export * from './point';


import nmath from './built-in';
import { Exception } from './_internals/errors';
import { strShuffle } from './_internals/utils';



/**
 * Return the n root of the provided number.
 * 
 * @param {number} x 
 * @param {number} [_n= 2] 
 * @returns {number}
 */
export const root = (x: number, _n: number = 2): number => x ** (1 / _n);


/**
 * Creates a function that calculates the arithmetic average of a series of numbers.
 * The returned function takes a number as input and updates the running sum and count
 * to calculate the arithmetic average. The function returns the current arithmetic average.
 *
 * @returns A function that calculates the arithmetic average.
 */
export function createArithmeticAverager(): ((value: number) => number) {
  let sum = 0, count = 0;

  return (value: number) => {
    if (value && typeof value === 'number') {
      sum += value;
      count++;
    }

    return sum / count;
  };
}

/**
 * Creates a function that calculates the geometric average of a series of numbers.
 * The returned function takes a number as input and updates the running product and count
 * to calculate the geometric average. The function returns the current geometric average.
 *
 * @returns A function that calculates the geometric average.
 */
export function createGeometricAverager(): ((value: number) => number) {
  let pow = 0, count = 0;

  return (value: number) => {
    if (value && typeof value === 'number') {
      if (pow === 0) {
        pow = value;
      } else {
        pow *= value;
      }

      count++;
    }

    return root(pow, count);
  };
}


/**
 * Calculates the arithmetic average of a variable number of input values.
 *
 * @param values - The numbers for which to calculate the arithmetic average.
 * @returns The arithmetic average of the input values.
 */
export function arithmeticAverage(...values: number[]): number {
  let sum = 0;

  for (const n of values) {
    sum += n;
  }

  return sum / values.length;
}


/**
 * Calculates the geometric average of a variable number of input values.
 * If the input array has less than 1 element, returns 0. If it has only 1 element,
 * returns that element.
 *
 * @param values - The numbers for which to calculate the geometric average.
 * @returns The geometric average of the input values.
 */
export function geometricAverage(...values: number[]): number {
  if (values.length < 1) return 0;
  if (values.length === 1) return values[0];

  let power = 0;

  for (const n of values) {
    if (power === 0) {
      power = n;
    } else {
      power *= n;
    }
  }

  return root(power, values.length);
}


/**
 * Clamps a number within a specified range defined by the minimum and maximum values.
 *
 * @param n - The number to be clamped.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The clamped value within the specified range.
 */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/**
 * Evaluates a given function over a range of x values and returns an object containing
 * an array of points, minimum and maximum y values, and the string representation of the function.
 *
 * @param f - The function to be evaluated.
 * @param x1 - The start of the x range.
 * @param x2 - The end of the x range.
 * @param n - The number of points to evaluate (default is the absolute difference between x1 and x2).
 * @returns An object containing points, min, max, and the string representation of the function.
 */
export function getFunctionValues(f: ((x: number) => number), x1: number, x2: number, n: number = nmath.abs(x1 - x2)) {
  try {
    const points = [];
    let min = Infinity;
    let max = -Infinity;

    const step = (x2 - x1) / n;
    // const reversed = x1 > x2; // Check if x1 is greater than x2
    const reversed = x1 > x2;

    // Adjust the step direction based on the order of x1 and x2
    const stepDirection = reversed ? -1 : 1;

    for (let i = 0; i <= n; i++) {
      const x = x1 + i * stepDirection * step;
      const y = f(x);

      points.push({ x, y });

      if (y < min) {
        min = y;
      }

      if (y > max) {
        max = y;
      }
    }

    return {
      points,
      min,
      max,
      'f(x)': f.toString(),
    };
  } catch (e) {
    return {
      points: [],
      min: Infinity,
      max: -Infinity,
      errors: [e],
    };
  }
}


/**
 * Checks if a given number is a power of two.
 *
 * @param num - The number to check.
 * @returns True if the number is a power of two, false otherwise.
 */
export function isPowerOfTwo(num: number): boolean {
  if (num < 1) return false; // Numbers less than 1 cannot be powers of 2

  // Bitwise AND operation: num & (num - 1) clears the rightmost set bit of num
  // If num is a power of 2, it will have only one set bit (MSB), and (num - 1) will have all the lower bits set.
  // So, num & (num - 1) will be 0 for powers of 2.
  return (num & (num - 1)) === 0;
}


/**
 * Rounds a given number to the nearest power of two.
 *
 * @param number - The number to round.
 * @returns The rounded number to the nearest power of two.
 * @throws Throws an error if the input number is less than or equal to zero.
 */
export function roundToPowerOfTwo(number: number): number {
  if (number <= 0) {
    throw new Exception('Number must be greater than zero.');
  }

  // Check if the number is already a power of two
  if ((number & (number - 1)) === 0) return number;

  let power = 1;

  while (power < number) {
    power <<= 1;
  }

  const nextPower = power;
  const previousPower = power >> 1;

  if (nextPower - number < number - previousPower) return nextPower;
  return previousPower;
}


/**
 * Checks if a given number is a prime number.
 *
 * @param n - The number to check for primality.
 * @returns True if the number is prime, false otherwise.
 */
export function isPrime(n: number): boolean {
  if (n <= 1) return false;

  if (n <= 3) return true;

  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }

  return true;
}


/**
 * Calculates the factorial of a given number.
 * 
 * @param x - The number for which to calculate the factorial.
 * @param verbose - If true, logs the factorial expression and result to the console.
 * @returns The factorial of the given number.
 * @throws Will throw an error if 'x' is negative, as factorial is undefined for negative numbers.
 */
export function factorial(x: number, verbose: boolean = false): number {
  // Check if 'x' is negative, as factorial is undefined for negative numbers.
  if (x < 0) {
    throw new Error('Cannot calculate factorial of a negative number');
  }

  // If 'x' is 0, the factorial is 1 by definition.
  if (x === 0) return 1;

  // Initialize variables for factors and result.
  const factors = [x];
  let factor: number,
    result: number;

  // Initialize factor and result to the initial value of 'x'.
  [factor, result] = [x, x];

  // Iterate through the factors to calculate the factorial.
  while (factor > 1) {
    factor--;
    result *= factor;
    factors.push(factor);
  }

  // If verbose mode is enabled, log the factorial expression and result to the console.
  if (verbose) {
    console.log(`${x}! = ${factors.join(' x ')} = ${result}`);
  }

  // Return the calculated factorial.
  return result;
}


/**
 * Rounds a given number to the nearest multiple of itself.
 * @param x - The number to be rounded.
 * @returns The rounded number (a multiple of 'x').
 */
export function roundToNearestMultiple(x: number): number {
  // Check if 'multiple' is 0, as rounding to the nearest multiple of 0 is undefined.
  if (x === 0) {
    throw new Exception('Cannot round to the nearest multiple of 0.');
  }

  return nmath.round(x / x) * x;
}


/**
 * Calculates the nth Fibonacci number using Binet's Formula.
 * Binet's Formula provides an efficient way to compute Fibonacci numbers
 * using the golden ratio (phi) and its conjugate.
 *
 * @param {number} n The position of the desired Fibonacci number (zero-based).
 * @returns {number} The nth Fibonacci number.
 */
export function fibonacciBinet(n: number): number {

  // Golden ratio (phi) = (1 + sqrt(5)) / 2
  const phi = (1 + nmath.sqrt(5)) / 2;

  // Binet's Formula for Fibonacci numbers
  // F(n) = round((phi^n - (-phi)^(-n)) / sqrt(5))
  return nmath.round((phi ** n - (-phi) ** -n) / nmath.sqrt(5));
}




/**
 * A lot of  matemathical utils, constants and functions to basically do everything you want.
 * 
 * @namespace math
 */
namespace math { // eslint-disable-line @typescript-eslint/no-namespace
  // Mathematical constants
  export const infinity = Infinity; // Positive infinity
  export const PI = Math.PI; // The mathematical constant pi
  export const E = Math.E; // The mathematical constant e
  export const LOG2E = Math.LOG2E; // Logarithm base 2 of E
  export const LOG10E = Math.LOG10E; // Logarithm base 10 of E
  export const LN2 = Math.LN2; // Natural logarithm of 2
  export const LN10 = Math.LN10; // Natural logarithm of 10
  export const SQRT2 = Math.SQRT2; // Square root of 2
  export const SQRT1_2 = Math.SQRT1_2; // Square root of 1/2
  export const sqrt = Math.sqrt; // Square root function
  export const pow = Math.pow; // Exponential function
  export const log = Math.log; // Natural logarithm
  export const log2 = Math.log2; // Base 2 logarithm
  export const log10 = Math.log10; // Base 10 logarithm
  export const abs = Math.abs; // Absolute value
  export const cos = Math.cos; // Cosine function
  export const cosh = Math.cosh; // Hyperbolic cosine function
  export const acos = Math.acos; // Arccosine function
  export const acosh = Math.acosh; // Hyperbolic arccosine function
  export const asin = Math.asin; // Arcsine function
  export const asinh = Math.asinh; // Hyperbolic arcsine function
  export const atan = Math.atan; // Arctangent function
  export const atan2 = Math.atan2; // Arctangent of the quotient of its arguments
  export const atanh = Math.atanh; // Hyperbolic arctangent function
  export const cbrt = Math.cbrt; // Cube root function
  export const ceil = Math.ceil; // Round a number up to the nearest integer
  export const clz32 = Math.clz32; // Count leading zero bits in 32-bit binary representation
  export const exp = Math.exp; // Exponential function
  export const expm1 = Math.expm1; // Exponential minus 1
  export const floor = Math.floor; // Round a number down to the nearest integer
  export const fround = Math.fround; // Round to the nearest 32-bit float
  export const hypot = Math.hypot; // Euclidean norm of the provided arguments
  export const imul = Math.imul; // 32-bit integer multiplication
  export const log1p = Math.log1p; // Natural logarithm of 1 plus the provided number
  export const max = Math.max; // Return the largest of zero or more numbers
  export const min = Math.min; // Return the smallest of zero or more numbers
  export const pseudorand = Math.random; // Pseudorandom number generator function
  export const round = Math.round; // Round a number to the nearest integer
  export const sign = Math.sign; // Sign of a number: 1, -1, or 0
  export const sin = Math.sin; // Sine function
  export const sinh = Math.sinh; // Hyperbolic sine function
  export const tan = Math.tan; // Tangent function
  export const tanh = Math.tanh; // Hyperbolic tangent function
  export const trunc = Math.trunc; // Truncate the decimal part of a number


  type ComparatorCallbackFn = ((arg_0: string | number, arg_1: string | number) => -1 | 0 | 1);

  /**
   * Compare two values and return 0 if they are equal, 1 if the first value is greater than the second one or -1 otherwise.
   * @class Comparator
   */
  export class Comparator {
    #callback: ComparatorCallbackFn;

    constructor(callback?: ComparatorCallbackFn) {
      this.#callback = callback || Comparator.#defaultCallback;
    }

    static #defaultCallback(a: number | string, b: number | string) {
      if (a === b) return 0;
      return a < b ? -1 : 1;
    }

    /**
     * Check if two values are equal `a ->> b`.
     * 
     * @param a 
     * @param b 
     * @returns 
     */
    public equal(a: number | string, b: number | string): boolean {
      return this.#callback(a, b) === 0;
    }

    /**
     * Check if value `a` is less than `b`.
     * @param a 
     * @param b 
     * @returns 
     */
    public lessThan(a: number | string, b: number | string): boolean {
      return this.#callback(a, b) < 0;
    }

    /**
     * Check if value `a` is greater than `b`.
     * @param a 
     * @param b 
     * @returns 
     */
    public greaterThan(a: number | string, b: number | string): boolean {
      return this.#callback(a, b) > 0;
    }

    /**
     * Check if value `a` is less than or equal to `b`.
     * @param a 
     * @param b 
     * @returns 
     */
    public lessThanOrEqual(a: number | string, b: number | string): boolean {
      return this.lessThan(a, b) || this.equal(a, b);
    }

    /**
     * Check if value `a` is greater than or equal to `b`.
     * @param a 
     * @param b 
     * @returns 
     */
    public greaterThanOrEqual(a: number | string, b: number | string): boolean {
      return this.greaterThan(a, b) || this.equal(a, b);
    }

    /**
     * Reverse the comparison order.
     * @returns 
     */
    public reverse(): this {
      const original = this.#callback;
      this.#callback = (a, b) => original(b, a);
      return this;
    }

    /**
     * Check if value `value` is between `min` and `max` values.
     * 
     * @param value 
     * @param min 
     * @param max 
     * @param include 
     * @returns 
     */
    public isBetween(value: number | string, min: number | string, max: number | string, include: boolean = false): boolean {
      if (!max || (typeof max !== 'number' && typeof max !== 'string')) {
        max = min;
        min = 0;
      }

      if (this[include === true ? 'greaterThanOrEqual' : 'greaterThan'](value, min) && this[include === true ? 'lessThanOrEqual' : 'lessThan'](value, max)) return true;
      return false;
    }
  }


  export class random {
    #value: number;
    #scale: number;

    constructor() {
      this.#value = pseudorand();
      this.#scale = 1;
    }

    /**
     * Get a random number between 0 and 1.
     */
    public static get random(): number {
      return pseudorand();
    }

    /**
     * Get a random integer number between `start` and `end`.
     * 
     * @param {number} start 
     * @param {number} end 
     * @param {string} round 
     * @returns {number}
     */
    public static integer(start: number, end?: number): number {
      return random.uniform(start, end, 'round');
    }

    /**
     * Get a random number between `start` and `end`.
     * 
     * @param {number} start 
     * @param {number} end 
     * @param {string} round 
     * @returns {number}
     */
    public static uniform(start: number, end?: number, round?: 'ceil' | 'floor' | 'round'): number {
      if (!end) {
        end = start;
        start = 0;
      }

      const random = pseudorand() * (end - start) + start;

      if (!round || !['ceil', 'floor', 'round'].includes(round)) return random;
      return nmath[round](random);
    }

    /**
     * Return a random string of the specified length with or without expecial characters.
     * 
     * @param {number} length 
     * @param {boolean} useSpecialChars 
     * @returns 
     */
    public static string(length: number, useSpecialChars: boolean = true): string {
      const keys: string = strShuffle(`abcdefghijklmnopqrstuvwxyz${'abcdefghijklmnopqrstuvwxyz'.toUpperCase()}0987654321${useSpecialChars ? '@#-_)([];:%*' : ''}`);
      let result: string = '';

      for (let i = 0; i < length; i++) {
        const offset = floor(pseudorand() * keys.length);
        result += keys.substring(offset, offset + 1);
      }

      return result;
    }

    /**
     * Return a random element from the provided array.
     * 
     * @param {any[]} arr 
     * @returns {any}
     */
    public static choose<T>(arr: ReadonlyArray<T>): T {
      const i = floor(pseudorand() * arr.length);
      return arr[i];
    }

    /**
     * Randomly permute a sequence, or return a permuted range.
     * 
     * If x is a multi-dimensional array, it is only shuffled along its first index keeping the sub-arrays in the same order.
     * 
     * If x is an array, make a copy and shuffle the elements randomly
     * 
     * If x is an integer, randomly permute.
     * 
     * @param x 
     * @returns 
     */
    public static permutation<T>(x: number | [T[], number]): T[] {
      let arr: T[];
      let size: number;

      if (Array.isArray(x)) {
        [arr, size] = x;
      } else {
        arr = (Array.from({ length: x }, (_, i) => i) as unknown as any);
        size = x;
      }

      for (let i = arr.length - 1; i > 0; i--) {
        const j = floor(pseudorand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      return arr.slice(0, size);
    }

    /**
     * Return the random number between 0 and 1 generated when the class was instantiated.
     */
    public get static(): number {
      return this.#value;
    }

    /**
     * Return a random number between 0 and 1 multiplied by the scale value.
     */
    public get random() {
      return pseudorand() * this.#scale;
    }

    /**
     * Set the scale value.
     * 
     * @param value 
     * @returns 
     */
    public scale(value: number): this {
      this.#scale = value;
      return this;
    }

    /**
     * Return the next random integer between 0 and n.
     * 
     * @param n 
     * @returns 
     */
    public nextInt(n: number | unknown[]): number {
      let result: number = -1;

      if (Array.isArray(n)) {
        if (n.length < 1) {
          throw new Exception('The provided array must contain at least one element.');
        }

        result = floor(pseudorand() * n.length);
      } else {
        if (!Number.isFinite(n)) {
          throw new Exception('The provided value must be a finite number.');
        }

        result = floor(this.random * (n + 1));
      }

      return result;
    }
  }

  export type VectorConversionMethods =
    | 'perspective_projection'
    | 'orthographic_projection';


  export class Vector {
    #x: number;
    #y: number;
    #z: number;
    #freezed: boolean;

    /**
     * Creates a new Vector instance from a serialized string representation.
     * 
     * @param serialized - The serialized string to be parsed.
     * @returns A new Vector instance.
     * @throws Exception if the serialized string is invalid or if the vector plane is not 3D.
     */
    public static from(serialized: string): Vector {
      try {
        const obj = JSON.parse(serialized);

        if (obj.plane !== '3d') {
          throw new Exception('Vector plane is not 3D');
        }

        return new Vector(obj.axis.x, obj.axis.y, obj.axis.z);
      } catch {
        throw new Exception('Invalid serialized vector');
      }
    }

    /**
     * Create a new vector.
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x: number, y: number, z: number) {
      [this.#x, this.#y, this.#z] = [x, y, z];
      this.#freezed = false;
    }

    /**
     * Axis X.
     */
    public get x(): number {
      return this.#x;
    }

    /**
     * Axis Y.
     */
    public get y(): number {
      return this.#y;
    }

    /**
     * Axis Z.
     */
    public get z(): number {
      return this.#z;
    }

    /**
     * Return true if the vector is freezed.
     */
    public get isFreezed(): boolean {
      return this.#freezed;
    }

    /**
     * Return the magnitude of the vector.
     * 
     * @returns 
     */
    public magnitude(): number {
      if (this.#freezed) {
        throw new Exception('Cannot get magnitude of a freezed vector');
      }

      return math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Return the normalized vector.
     * 
     * @returns 
     */
    public normalize(): Vector {
      if (this.#freezed) {
        throw new Exception('Cannot normalize a freezed vector');
      }

      const mag = this.magnitude();

      if (mag === 0) {
        throw new Exception('Cannot normalize a zero vector', {
          reason: 'division by zero',
        });
      }

      return new Vector(this.x / mag, this.y / mag, this.z / mag);
    }

    /**
     * Add a vector to the current one.
     * 
     * @param vec 
     * @returns 
     */
    public add(vec: Vector): Vector {
      if (this.#freezed) {
        throw new Exception('Cannot add a freezed vector');
      }

      return new Vector(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    /**
     * Subtract a vector from the current one.
     * 
     * @param vec 
     * @returns 
     */
    public subtract(vec: Vector): Vector {
      if (this.#freezed) {
        throw new Exception('Cannot subtract a freezed vector');
      }

      return new Vector(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    /**
     * Return the dot product of the current vector and the provided one.
     * 
     * @param vec 
     * @returns 
     */
    public dot(vec: Vector): number {
      if (this.#freezed) {
        throw new Exception('Cannot dot a freezed vector');
      }

      return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    /**
     * Return the cross product of the current vector and the provided one.
     * 
     * @param vec 
     * @returns 
     */
    public cross(vec: Vector): Vector {
      if (this.#freezed) {
        throw new Exception('Cannot cross a freezed vector');
      }

      return new Vector(this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x);
    }

    /**
     * Scale the current vector by the provided scalar.
     * 
     * @param scalar 
     * @returns 
     */
    public scale(scalar: number): Vector {
      if (this.#freezed) {
        throw new Exception('Cannot scale a freezed vector');
      }

      return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    /**
     * Freeze the current vector to prevent modifications.
     */
    public freeze(): void {
      this.#freezed = true;
    }

    /**
     * Serializes the Vector instance to a string representation.
     * 
     * @returns A serialized string representing the Vector.
     */
    public serialize(): string {
      return JSON.stringify({
        name: 'Vector',
        plane: '3d',
        axis: {
          x: this.x,
          y: this.y,
          z: this.z,
        },
      });

    }
  }


  export class Vector2D {
    #x: number;
    #y: number;
    #freezed: boolean;

    /**
     * Creates a new Vector2D instance from a serialized string representation.
     * 
     * @param serialized - The serialized string to be parsed.
     * @returns A new Vector2D instance.
     * @throws Exception if the serialized string is invalid or if the vector plane is not 2D.
     */
    public static from(serialized: string): Vector2D {
      try {
        const obj = JSON.parse(serialized);

        if (obj.plane !== '2d') {
          throw new Exception('Vector plane is not 2D');
        }

        return new Vector2D(obj.axis.x, obj.axis.y);
      } catch {
        throw new Exception('Invalid serialized vector');
      }
    }

    /**
     * Create a new 2D vector.
     * 
     * @param x 
     * @param y 
     */
    constructor(x: number, y: number) {
      this.#x = x;
      this.#y = y;
      this.#freezed = false;
    }

    /**
     * Axis X.
     */
    public get x(): number {
      return this.#x;
    }

    /**
     * Axis Y.
     */
    public get y(): number {
      return this.#y;
    }

    /**
     * Return true if the vector is freezed.
     */
    public get isFreezed(): boolean {
      return this.#freezed;
    }

    /**
     * Return the magnitude of the vector.
     * 
     * @returns 
     */
    public magnitude(): number {
      if (this.#freezed) {
        throw new Exception('Cannot get magnitude of a freezed vector');
      }

      return math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Return the normalized vector.
     * 
     * @returns 
     */
    public normalize(): Vector2D {
      if (this.#freezed) {
        throw new Exception('Cannot normalize a freezed vector');
      }

      const mag = this.magnitude();
      return new Vector2D(this.x / mag, this.y / mag);
    }

    /**
     * Add a vector to the current one.
     * 
     * @param vec 
     * @returns 
     */
    public add(vec: Vector2D): Vector2D {
      if (this.#freezed) {
        throw new Exception('Cannot add a freezed vector');
      }

      return new Vector2D(this.x + vec.x, this.y + vec.y);
    }

    /**
     * Subtract a vector from the current one.
     * 
     * @param vec 
     * @returns 
     */
    public subtract(vec: Vector2D): Vector2D {
      if (this.#freezed) {
        throw new Exception('Cannot subtract a freezed vector');
      }

      return new Vector2D(this.x - vec.x, this.y - vec.y);
    }

    /**
     * Return the dot product of the current vector and the provided one.
     * 
     * @param vec 
     * @returns 
     */
    public dot(vec: Vector2D): number {
      if (this.#freezed) {
        throw new Exception('Cannot dot a freezed vector');
      }

      return this.x * vec.x + this.y * vec.y;
    }

    /**
     * Scale the current vector by the provided scalar.
     * 
     * @param scalar 
     * @returns 
     */
    public scale(scalar: number): Vector2D {
      if (this.#freezed) {
        throw new Exception('Cannot scale a freezed vector');
      }

      return new Vector2D(this.x * scalar, this.y * scalar);
    }

    /**
     * Freeze the current vector to prevent modifications.
     */
    public freeze(): void {
      this.#freezed = true;
    }

    /**
     * Serializes the Vector2D instance to a string representation.
     * 
     * @returns A serialized string representing the Vector2D.
     */
    public serialize(): string {
      return JSON.stringify({
        name: 'Vector2D',
        plane: '2d',
        axis: {
          x: this.x,
          y: this.y,
        },
      });
    }
  }


  export type PointFromVectorOptions = {
    conversionMethod?: VectorConversionMethods;
    projectionPlaneZ?: number;
    focalLength?: number;
  }

  /**
   * Represents a 2D point in a coordinate system.
   */
  export class Point {

    /**
     * Create a new point from a vector.
     * 
     * __Methods to translate a 3D vector to a 2D point:__
     * 
     * - `Perspective projection`: The most common method to convert a 3D vector to a 2D point by isolating the Z axis and using the focal length and the projection plane Z. The axis X and Y are scaled by the focal length divided by the sum of the projection plane Z and the vector Z.
     * - `Orthographic projection`: A method to convert a 3D vector to a 2D point using an orthographic projection.
     * 
     * @param {Vector|Vector2D} vec - The input vector (either 2D or 3D).
     * @param {PointFromVectorOptions} options - Options for the conversion process.
     * @returns {Point} A new Point instance representing the 2D point.
     */
    public static fromVector(vec: Vector | Vector2D, options?: PointFromVectorOptions): Point {
      let p: Point = new Point(-1, -1);
      // vec.freeze();

      if (vec instanceof Vector2D) {
        p = new Point(vec.x, vec.y);
      } else if (vec instanceof Vector) {
        if (!options?.conversionMethod) {
          if (vec.z !== 0) {
            throw new Exception('Cannot convert 3D vector to 2D point');
          }

          p = new Point(vec.x, vec.y);
        } else {
          if (vec.z === 0) {
            throw new Exception('Cannot convert 3D vector to 2D point');
          }

          switch (options.conversionMethod ?? 'orthographic_projection') {
            case 'orthographic_projection':
              p = new Point(vec.x, vec.y);
              break;
            case 'perspective_projection': {
              const focalLength = options.focalLength ?? 1.0;
              const projectionPlaneZ = options.projectionPlaneZ ?? 1.0;

              const scale = focalLength / (projectionPlaneZ + vec.z);
              p = new Point(vec.x * scale, vec.y * scale);
              break;
            }
          }
        }
      }

      return p;
    }


    #x: number;
    #y: number;
    #freezed: boolean;

    /**
     * Constructor for the Point class.
     * 
     * @param {number} x - The X-coordinate of the point.
     * @param {number} y - The Y-coordinate of the point.
     */
    constructor(x: number, y: number) {
      [this.#x, this.#y] = [x, y];
      this.#freezed = false;
    }

    /**
     * Get the X-coordinate of the point.
     * 
     * @returns {number} - The X-coordinate.
     */
    public get x(): number {
      return this.#x;
    }

    /**
     * Get the Y-coordinate of the point.
     * 
     * @returns {number} - The Y-coordinate.
     */
    public get y(): number {
      return this.#y;
    }

    /**
     * Add another point to this point.
     * 
     * @param {Point} point - The point to add.
     * @returns {Point} - A new Point instance representing the result of the addition.
     * @throws {Exception} - If the current point is frozen.
     */
    public add(point: Point): Point {
      if (this.#freezed) {
        throw new Exception('Cannot add to frozen point');
      }

      return new Point(this.x + point.x, this.y + point.y);
    }

    /**
     * Subtract another point from this point.
     * 
     * @param {Point} point - The point to subtract.
     * @returns {Point} - A new Point instance representing the result of the subtraction.
     * @throws {Exception} - If the current point is frozen.
     */
    public subtract(point: Point): Point {
      if (this.#freezed) {
        throw new Exception('Cannot subtract from frozen point');
      }

      return new Point(this.x - point.x, this.y - point.y);
    }

    /**
     * Scale the point by a scalar value.
     * 
     * @param {number} scalar - The scalar value to multiply the coordinates by.
     * @returns {Point} - A new Point instance representing the scaled point.
     * @throws {Exception} - If the current point is frozen.
     */
    public scale(scalar: number): Point {
      if (this.#freezed) {
        throw new Exception('Cannot scale frozen point');
      }

      return new Point(this.x * scalar, this.y * scalar);
    }

    /**
     * Freeze the point, preventing further modifications.
     */
    public freeze(): void {
      this.#freezed = true;
    }
  }

  /**
   * Return the n root of the provided number.
   * 
   * @param {number} x 
   * @param {number} [_n= 2] 
   * @returns {number}
   */
  export const root = (x: number, _n: number = 2): number => x ** (1 / _n);


  /**
   * Creates a function that calculates the arithmetic average of a series of numbers.
   * The returned function takes a number as input and updates the running sum and count
   * to calculate the arithmetic average. The function returns the current arithmetic average.
   *
   * @returns A function that calculates the arithmetic average.
   */
  export function createArithmeticAverager(): ((value: number) => number) {
    let sum = 0, count = 0;

    return (value: number) => {
      if (value && typeof value === 'number') {
        sum += value;
        count++;
      }

      return sum / count;
    };
  }

  /**
   * Creates a function that calculates the geometric average of a series of numbers.
   * The returned function takes a number as input and updates the running product and count
   * to calculate the geometric average. The function returns the current geometric average.
   *
   * @returns A function that calculates the geometric average.
   */
  export function createGeometricAverager(): ((value: number) => number) {
    let pow = 0, count = 0;

    return (value: number) => {
      if (value && typeof value === 'number') {
        if (pow === 0) {
          pow = value;
        } else {
          pow *= value;
        }

        count++;
      }

      return root(pow, count);
    };
  }


  /**
   * Calculates the arithmetic average of a variable number of input values.
   *
   * @param values - The numbers for which to calculate the arithmetic average.
   * @returns The arithmetic average of the input values.
   */
  export function arithmeticAverage(...values: number[]): number {
    let sum = 0;

    for (const n of values) {
      sum += n;
    }

    return sum / values.length;
  }


  /**
   * Calculates the geometric average of a variable number of input values.
   * If the input array has less than 1 element, returns 0. If it has only 1 element,
   * returns that element.
   *
   * @param values - The numbers for which to calculate the geometric average.
   * @returns The geometric average of the input values.
   */
  export function geometricAverage(...values: number[]): number {
    if (values.length < 1) return 0;
    if (values.length === 1) return values[0];

    let power = 0;

    for (const n of values) {
      if (power === 0) {
        power = n;
      } else {
        power *= n;
      }
    }

    return root(power, values.length);
  }


  /**
   * Clamps a number within a specified range defined by the minimum and maximum values.
   *
   * @param n - The number to be clamped.
   * @param min - The minimum value of the range.
   * @param max - The maximum value of the range.
   * @returns The clamped value within the specified range.
   */
  export function clamp(n: number, min: number, max: number): number {
    return nmath.min(nmath.max(n, min), max);
  }

  /**
   * Evaluates a given function over a range of x values and returns an object containing
   * an array of points, minimum and maximum y values, and the string representation of the function.
   *
   * @param f - The function to be evaluated.
   * @param x1 - The start of the x range.
   * @param x2 - The end of the x range.
   * @param n - The number of points to evaluate (default is the absolute difference between x1 and x2).
   * @returns An object containing points, min, max, and the string representation of the function.
   */
  export function getFunctionValues(f: ((x: number) => number), x1: number, x2: number, n: number = abs(x1 - x2)) {
    try {
      const c = new Comparator();
      const points = [];
      let min = Infinity;
      let max = -Infinity;

      const step = (x2 - x1) / n;
      // const reversed = x1 > x2; // Check if x1 is greater than x2
      const reversed = c.greaterThan(x1, x2);

      // Adjust the step direction based on the order of x1 and x2
      const stepDirection = reversed ? -1 : 1;

      for (let i = 0; i <= n; i++) {
        const x = x1 + i * stepDirection * step;
        const y = f(x);

        points.push({ x, y });

        if (y < min) {
          min = y;
        }

        if (y > max) {
          max = y;
        }
      }

      return {
        points,
        min,
        max,
        'f(x)': f.toString(),
      };
    } catch (e) {
      return {
        points: [],
        min: Infinity,
        max: -Infinity,
        errors: [e],
      };
    }
  }


  /**
   * Checks if a given number is a power of two.
   *
   * @param num - The number to check.
   * @returns True if the number is a power of two, false otherwise.
   */
  export function isPowerOfTwo(num: number): boolean {
    if (num < 1) return false; // Numbers less than 1 cannot be powers of 2

    // Bitwise AND operation: num & (num - 1) clears the rightmost set bit of num
    // If num is a power of 2, it will have only one set bit (MSB), and (num - 1) will have all the lower bits set.
    // So, num & (num - 1) will be 0 for powers of 2.
    return (num & (num - 1)) === 0;
  }


  /**
   * Rounds a given number to the nearest power of two.
   *
   * @param number - The number to round.
   * @returns The rounded number to the nearest power of two.
   * @throws Throws an error if the input number is less than or equal to zero.
   */
  export function roundToPowerOfTwo(number: number): number {
    if (number <= 0) {
      throw new Exception('Number must be greater than zero.');
    }

    // Check if the number is already a power of two
    if ((number & (number - 1)) === 0) return number;

    let power = 1;

    while (power < number) {
      power <<= 1;
    }

    const nextPower = power;
    const previousPower = power >> 1;

    if (nextPower - number < number - previousPower) return nextPower;
    return previousPower;
  }


  /**
   * Checks if a given number is a prime number.
   *
   * @param n - The number to check for primality.
   * @returns True if the number is prime, false otherwise.
   */
  export function isPrime(n: number): boolean {
    if (n <= 1) return false;

    if (n <= 3) return true;

    if (n % 2 === 0 || n % 3 === 0) return false;

    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }

    return true;
  }


  /**
   * Sigmoid activation function. Returns the result of the sigmoid function for the given input.
   *
   * @param x - The input value.
   * @returns The result of the sigmoid function.
   */
  export const sigmoid2 = (x: number) => Math.pow(Math.E, x) / (Math.pow(Math.E, x) + 1);

  /**
   * Exponential Linear Unit (ELU) activation function. Returns the result of the ELU function for the given input.
   *
   * @param x - The input value.
   * @param alpha - The alpha parameter (default is 1.0).
   * @returns The result of the ELU function.
   */
  export const elu = (x: number, alpha: number = 1.0) => x >= 0 ? x : alpha * (Math.exp(x) - 1);

  /**
   * Leaky Rectified Linear Unit (Leaky ReLU) activation function.
   * Returns the result of the Leaky ReLU function for the given input.
   *
   * @param x - The input value.
   * @param alpha - The alpha parameter (default is 0.1).
   * @returns The result of the Leaky ReLU function.
   */
  export const leakyRelu = (x: number, alpha: number = 0.1) => x >= 0 ? x : alpha * x;

  /**
   * Softplus activation function. Returns the result of the Softplus function for the given input.
   *
   * @param x - The input value.
   * @returns The result of the Softplus function.
   */
  export const softplus = (x: number) => Math.log(1 + Math.exp(x));

  /**
   * Standard Sigmoid activation function. Returns the result of the standard sigmoid function for the given input.
   *
   * @param x - The input value.
   * @returns The result of the standard sigmoid function.
   */
  export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  /**
   * Perceptron activation function. Returns 1 if the input is greater than or equal to 0, otherwise returns 0.
   *
   * @param x - The input value.
   * @returns 1 if the input is greater than or equal to 0, 0 otherwise.
   */
  export const perceptron = (x: number) => x >= 0 ? 1 : 0;

  /**
   * Rectified Linear Unit (ReLU) activation function. Returns the result of the ReLU function for the given input.
   *
   * @param x - The input value.
   * @returns The result of the ReLU function.
   */
  export const relu = (x: number) => Math.min(0, x);

  /**
   * Softmax activation function. Returns an array of probabilities computed using the softmax function
   * for the given array of input values.
   *
   * @param x - The array of input values.
   * @returns An array of probabilities computed using the softmax function.
   */
  export function softmax(x: number[]): number[] {
    const exps = x.map(Math.exp);
    const sumExps = exps.reduce((acc, val) => acc + val);
    return exps.map((val) => val / sumExps);
  }




  /**
   * Calculates the factorial of a given number.
   * 
   * @param x - The number for which to calculate the factorial.
   * @param verbose - If true, logs the factorial expression and result to the console.
   * @returns The factorial of the given number.
   * @throws Will throw an error if 'x' is negative, as factorial is undefined for negative numbers.
   */
  export function factorial(x: number, verbose: boolean = false): number {
    // Check if 'x' is negative, as factorial is undefined for negative numbers.
    if (x < 0) {
      throw new Error('Cannot calculate factorial of a negative number');
    }

    // If 'x' is 0, the factorial is 1 by definition.
    if (x === 0) return 1;

    // Initialize variables for factors and result.
    const factors = [x];
    let factor: number,
      result: number;

    // Initialize factor and result to the initial value of 'x'.
    [factor, result] = [x, x];

    // Iterate through the factors to calculate the factorial.
    while (factor > 1) {
      factor--;
      result *= factor;
      factors.push(factor);
    }

    // If verbose mode is enabled, log the factorial expression and result to the console.
    if (verbose) {
      console.log(`${x}! = ${factors.join(' x ')} = ${result}`);
    }

    // Return the calculated factorial.
    return result;
  }


  /**
   * Rounds a given number to the nearest multiple of itself.
   * @param x - The number to be rounded.
   * @returns The rounded number (a multiple of 'x').
   */
  export function roundToNearestMultiple(x: number): number {
    // Check if 'multiple' is 0, as rounding to the nearest multiple of 0 is undefined.
    if (x === 0) {
      throw new Exception('Cannot round to the nearest multiple of 0.');
    }

    return nmath.round(x / x) * x;
  }


  /**
   * Calculates the nth Fibonacci number using Binet's Formula.
   * Binet's Formula provides an efficient way to compute Fibonacci numbers
   * using the golden ratio (phi) and its conjugate.
   *
   * @param {number} n The position of the desired Fibonacci number (zero-based).
   * @returns {number} The nth Fibonacci number.
   */
  export function fibonacciBinet(n: number): number {
    
    // Golden ratio (phi) = (1 + sqrt(5)) / 2
    const phi = (1 + sqrt(5)) / 2;

    // Binet's Formula for Fibonacci numbers
    // F(n) = round((phi^n - (-phi)^(-n)) / sqrt(5))
    return round((phi ** n - (-phi) ** -n) / sqrt(5));
  }
}

export default math;
