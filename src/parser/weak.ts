import nmath from '../built-in';
import { Exception } from '../_internals/errors';


type Token = string | number;
type ConstMap = { [key: string]: number };
type FunctionMap = { [key: string]: (...args: any[]) => number };


export const supportedFunctions = Object.freeze([
  'sin',
  'cos',
  'tan',
  'atan',
  'asin',
  'acos',
  'abs',
  'sqrt',
  'ln',
  'log_two',
  'log_ten',
  'log',
  'logn',
  'exp',
] as const);

export type SupportedFunctions = (typeof supportedFunctions)[number];


export const supportedConstants = Object.freeze([ 'PI', 'E' ] as const);

export type SupportedConstants = (typeof supportedConstants)[number];


// Define supported functions and operations
const functions: FunctionMap = {
  sin: nmath.sin,
  cos: nmath.cos,
  tan: nmath.tan,
  atan: nmath.atan,
  asin: nmath.asin,
  acos: nmath.acos,
  abs: nmath.abs,
  sqrt: nmath.sqrt,
  ln: (x: number) => nmath.log(x),
  log_two: (x: number) => nmath.log2(x),
  log_ten: (x: number) => nmath.log10(x),
  log: (x: number, base: number = 10) => nmath.log(x) / nmath.log(base),
  logn: (x: number, base: number = 10) => nmath.round((nmath.log(x) / nmath.log(base)) * 10),
  exp: nmath.exp,
};

const constants: ConstMap = {
  PI: nmath.PI,
  E: nmath.E,
};

const operators: { [key: string]: { precedence: number; associativity: 'left' | 'right'; func: (a: number, b: number) => number } } = {
  '+': { precedence: 1, associativity: 'left', func: (a, b) => a + b },
  '-': { precedence: 1, associativity: 'left', func: (a, b) => a - b },
  '*': { precedence: 2, associativity: 'left', func: (a, b) => a * b },
  '/': { precedence: 2, associativity: 'left', func: (a, b) => a / b },
  '^': { precedence: 3, associativity: 'right', func: (a, b) => nmath.pow(a, b) },
};


function tokenize(expression: string): Token[] {
  const tokens = [] as Token[];

  // eslint-disable-next-line no-useless-escape
  const regex = /\s*([()^*/+\-]|\d+\.?\d*|\.\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*/g;
  let match: RegExpExecArray | null;

  while((match = regex.exec(expression)) !== null) {
    const token = match[1];

    if(!isNaN(Number(token))) {
      tokens.push(parseFloat(token));
    } else if(token in constants) {
      tokens.push(constants[token]);
    } else {
      tokens.push(token);
    }
  }

  return tokens;
}

// Convert tokens from infix notation to postfix notation using the shunting yard algorithm
function infixToPostfix(tokens: Token[]): Token[] {
  const outputQueue: Token[] = [];
  const operatorStack: string[] = [];

  for(const token of tokens) {
    if(typeof token === 'number') {
      outputQueue.push(token);
    } else if(token in functions) {
      operatorStack.push(token);
    } else if(token === ',') {
      while(operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }
    } else if (token in operators) {
      const o1 = token;

      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        ((operators[o1].associativity === 'left' && operators[o1].precedence <= operators[operatorStack[operatorStack.length - 1]].precedence) ||
          (operators[o1].associativity === 'right' && operators[o1].precedence < operators[operatorStack[operatorStack.length - 1]].precedence))
      ) {
        outputQueue.push(operatorStack.pop()!);
      }

      operatorStack.push(o1);
    } else if(token === '(') {
      operatorStack.push(token);
    } else if(token === ')') {
      while(operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop()!);
      }

      operatorStack.pop(); // Pop the '('

      if(operatorStack.length && operatorStack[operatorStack.length - 1] in functions) {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }

  while(operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop()!);
  }

  return outputQueue;
}

// Evaluate the postfix expression
function evaluatePostfix(tokens: Token[]): number {
  const stack: number[] = [];

  for(const token of tokens) {
    if(typeof token === 'number') {
      stack.push(token);
    } else if(token in operators) {
      const b = stack.pop()!;
      const a = stack.pop()!;

      stack.push(operators[token].func(a, b));
    } else if(token in functions) {
      const a = stack.pop()!;
      stack.push(functions[token](a));
    }
  }

  return stack.pop()!;
}

function validateExpression(expression: string): void {
  // Check for balanced parentheses
  let openParentheses = 0;

  for(const char of expression) {
    if(char === '(') {
      openParentheses++;
    } else if(char === ')') {
      openParentheses--;
    }

    if(openParentheses < 0) {
      throw new SyntaxError('Mismatched parentheses - too many closing parentheses.');
    }
  }

  if(openParentheses > 0) {
    throw new SyntaxError('Mismatched parentheses - too many opening parentheses.');
  }

  // Remove all occurrences of valid function names and constants from the expression
  const sanitizedExpression = expression.replace(new RegExp(`\\b(${supportedFunctions.join('|')}|${supportedConstants.join('|')})\\b`, 'g'), '');

  // Allowed characters: numbers, operators, parentheses, comma, whitespace
  const validTokens = /^[\d+\-*/^(),.\s]+$/;

  // Check if the sanitized expression matches only valid tokens
  if(!validTokens.test(sanitizedExpression)) {
    throw new TypeError(`Expression contains invalid characters or unsupported tokens '${sanitizedExpression}'`);
  }
}


export type EvaluationResult<E = Error> = (
  | {
    readonly status: 'failed';
    readonly errors: readonly unknown[];
    readonly errorObject: E;
    readonly tokens: Token[] | null;
  }
  | {
    readonly status: 'sucessful';
    readonly result: number;
    readonly tokens: Token[];
  }
) & {
  readonly expression: string;
}

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
 * @returns An object of type `EvaluationResult`:
 *          - If evaluation is successful, returns `{ status: 'successful', result, expression }`
 *          - If evaluation fails, returns `{ status: 'failed', errors, errorObject, expression }`
 *
 * @example
 * evaluateExpression("3 + 4 * 2") // Returns 11
 * evaluateExpression("log(100)")  // Returns 2 (base 10 by default)
 * evaluateExpression("ln(exp(1))") // Returns 1
 */
export function evaluateExpression<E extends Error = Exception>(expression: string): EvaluationResult<E> {
  let tokens: Token[] | null = null;

  try {
    validateExpression(expression);

    tokens = tokenize(expression);
    const postfixTokens = infixToPostfix(tokens);
    
    const result = evaluatePostfix(postfixTokens);

    return Object.freeze<EvaluationResult<E>>({
      status: 'sucessful',
      expression,
      result,
      tokens,
    });
  } catch (error: any) {
    let errorObject: any = new Exception('Unknown evaluation error');

    if(error instanceof Error || error instanceof Exception) {
      errorObject = error;
    } else {
      errorObject = new Exception(error.message || error, { error, stack: error.stack });
    }

    return Object.freeze<EvaluationResult<E>>({
      status: 'failed',
      errors: Object.freeze([error]),
      expression,
      errorObject,
      tokens,
    });
  }
}

export default evaluateExpression;
