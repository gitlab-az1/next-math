import { Exception } from '../_internals/errors';
import { constants, functions } from './_preset';
import { BinaryExpression, CallExpression, ConstantAssignmentExpression, Expression, NumericLiteralExpression, UnaryExpression } from './ast';


export class Evaluator {
  public static evaluate(node: Expression): number {
    switch (node.kind) {
      case 'NumericLiteral':
        return (<NumericLiteralExpression>node).value;
      case 'ConstantAssignment':
        return constants[(<ConstantAssignmentExpression>node).name] ?? (<ConstantAssignmentExpression>node).value;
      case 'BinaryExpression':
        return Evaluator.#evaluateBinaryExpression((<BinaryExpression>node).operator, Evaluator.evaluate((<BinaryExpression>node).left), Evaluator.evaluate((<BinaryExpression>node).right));
      case 'UnaryExpression':
        return Evaluator.#evaluateUnaryExpression((<UnaryExpression>node).operator, Evaluator.evaluate((<UnaryExpression>node).expression));
      case 'CallExpression':
        return Evaluator.#evaluateFunctionCall((<CallExpression>node).name, (<CallExpression>node).arguments);
      default:
        throw new Exception(`Unknown expression node \`${node.kind}\``);
    }
  }

  static #evaluateBinaryExpression(operator: string, left: number, right: number): number {
    switch (operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      case '%': return left % right;
      case '^':
      case '**': return Math.pow(left, right);
      default:
        throw new Exception(`Unknown operator: ${operator}`);
    }
  }

  static #evaluateUnaryExpression(operator: string, value: number): number {
    if(operator === '-') return -value;
    throw new Exception(`Unknown unary operator: ${operator}`);
  }

  static #evaluateFunctionCall(name: string, args: Expression[]): number {
    const evaluatedArgs = args.map(arg => Evaluator.evaluate(arg));
    const func = functions[name];

    if(!func) {
      throw new Exception(`Unknown function: ${name}`);
    }
    
    return func(...evaluatedArgs);
  }
}
