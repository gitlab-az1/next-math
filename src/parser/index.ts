import Lexer from './lexer';
import { Token } from './tokens';
import { Parser } from './parser';
import { Expression } from './ast';
import { Evaluator } from './evaluator';
import { Exception } from '../_internals/errors';


export * from './ast';
export * from './tokens';
export * from './_preset';
export { Lexer } from './lexer';
export { Parser } from './parser';
export { EvaluationResult as WeakEvaluationResult, evaluateExpression as weakEvaluateExpression } from './weak';


export type EvaluationResult<E = Exception> = (
  | {
    readonly status: 'failed';
    readonly errors: readonly unknown[];
    readonly errorObject: E;
    readonly astRoot: Expression | null;
    readonly tokens: readonly Token[] | null;
  }
  | {
    readonly status: 'sucessful';
    readonly result: number;
    readonly astRoot: Expression;
    readonly tokens: readonly Token[];
  }
) & {
  readonly expression: string;
};


/**
 * Evaluates a mathematical expression given as a string.
 *
 * This function takes an infix mathematical expression as a string input,
 * tokenizes it, converts it to postfix notation, and then evaluates the
 * result. Supported operations include basic arithmetic, parentheses,
 * trigonometric functions (e.g., sin, cos), logarithmic functions (log with
 * optional base and ln), and constants like PI.
 *
 * @param expression - The mathematical expression to evaluate, written in infix notation.
 *                      Examples: `3 + 4 * 2 / (1 - 5) ^ 2 ^ 3`, `sin(PI / 2)`, `log(8, 2)`
 *
 * @example
 * evaluateExpression("3 + 4 * 2") // Returns 11
 * evaluateExpression("log(100)")  // Returns 2 (base 10 by default)
 * evaluateExpression("ln(exp(1))") // Returns 1
 */
export function evaluate<E = Exception>(expression: string): EvaluationResult<E> {
  let tokens: Token[] | null = null;
  let astRoot: Expression | null = null;

  try {
    const tokenizer = new Lexer(expression);
    tokens = tokenizer.tokenize();

    const parser = new Parser(tokens);
    astRoot = parser.parse();

    const result = Evaluator.evaluate(astRoot);

    return Object.freeze<EvaluationResult<E>>({
      status: 'sucessful',
      expression,
      astRoot,
      tokens,
      result,
    });
  } catch (error: any) {
    let e: any = error;

    if(!(error instanceof Error) && !(error instanceof Exception)) {
      const extractedProps = {} as { [key: string]: any };

      for(const prop in error) {
        if(typeof error[prop] === 'function') continue;
        extractedProps[prop] = error[prop];
      }

      e = new Exception(String(error.message || error), { error, extractedProps, stack: error.stack });
    }

    return Object.freeze<EvaluationResult<E>>({
      tokens,
      astRoot,
      errorObject: e,
      errors: [error],
      expression,
      status: 'failed',
    });
  }
}

export default evaluate;
