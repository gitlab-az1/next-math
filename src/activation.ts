
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
