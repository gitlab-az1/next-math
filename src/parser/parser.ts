import { Exception } from '../_internals/errors';
import { BinaryOperatorToken, ConstantToken, FunctionToken, NumericToken, Token, TokenKind } from './tokens';
import { BinaryExpression, CallExpression, ConstantAssignmentExpression, Expression, NumericLiteralExpression, UnaryExpression } from './ast';


export class Parser {
  readonly #tokens: Token[];
  #position: number;

  public constructor(_tokens: Token[]) {
    this.#tokens = _tokens;
    this.#position = 0;
  }

  public parse(): Expression {
    return this.#parseExpression();
  }

  #parseExpression(precedence: number = 0): Expression {
    let left = this.#parsePrimary();

    while(this.#current() && this.#isBinaryOperator(this.#current()) && this.#getPrecedence(this.#current()) >= precedence) {
      const operator = (this.#advance() as BinaryOperatorToken).operator;
      const currentPrecedence = this.#getPrecedence({ kind: 'binary_operator', operator } as Token);

      // Determine if the operator is right-associative
      const isRightAssociative = operator === '**' || operator === '^';
      const nextPrecedence = isRightAssociative ? currentPrecedence : currentPrecedence + 1;

      const right = this.#parseExpression(nextPrecedence);
      left = { kind: 'BinaryExpression', operator, left, right } as BinaryExpression;
    }

    return left;
  }

  #parsePrimary(): Expression {
    const token = this.#advance();

    if(!token) {
      throw new Exception('Unexpected end of input');
    }

    switch (token.kind) {
      case 'numeric':
      case 'integer':
      case 'decimal':
        return { kind: 'NumericLiteral', value: (token as NumericToken).value } as NumericLiteralExpression;
      case 'func':
        return this.#parseFunctionCall(token as FunctionToken);
      case 'const': {
        const constantToken = token as ConstantToken;
        return { kind: 'ConstantAssignment', name: constantToken.name, value: constantToken.value } as ConstantAssignmentExpression;
      }
      case 'open_paren': {
        const expr = this.#parseExpression();
        this.#expect('close_paren');

        return expr;
      }
      case 'binary_operator':
        if((<any>token).operator === '-') return { kind: 'UnaryExpression', operator: '-', expression: this.#parsePrimary() } as UnaryExpression;
    }

    throw new Exception(`Unexpected token ${token.kind}`);
  }

  #parseFunctionCall(funcToken: FunctionToken): CallExpression {
    const args: Expression[] = [];
    this.#expect('open_paren');

    while(this.#current() && this.#current()!.kind !== 'close_paren') {
      args.push(this.#parseExpression());

      if(this.#current()?.kind === 'comma') {
        this.#advance();
      }
    }

    this.#expect('close_paren');
    return { kind: 'CallExpression', name: funcToken.name, arguments: args };
  }

  #expect(kind: TokenKind) {
    const token = this.#advance();

    if(!token || token.kind !== kind) {
      throw new Exception(`Expected a \`${kind}\` token in source, but got \`${token?.kind}\``);
    }
  }

  #isBinaryOperator(token?: Token | null): boolean {
    return token?.kind === 'binary_operator';
  }

  #getPrecedence(token: Token | null): number {
    if(!this.#isBinaryOperator(token)) return 0;
    // Ensure `**` and `^` have highest precedence, and handle them as right-associative
    return ['**', '^'].includes((<any>token).operator) ? 4 :
      ['*', '/', '%'].includes((<any>token).operator) ? 3 :
        ['+', '-'].includes((<any>token).operator) ? 2 : 1;
  }

  #advance(): Token | null {
    return this.#position < this.#tokens.length ? this.#tokens[this.#position++] : null;
  }

  #current(): Token | null {
    return this.#position < this.#tokens.length ? this.#tokens[this.#position] : null;
  }
}

export default Parser;
