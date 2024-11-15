import { Exception } from '../_internals/errors';
import { createToken, type Token } from './tokens';
import { isFunction, isConstant, constants } from './_preset';


const ignorables: readonly string[] = [' ', '\n', '\r', '\r\n', '\t'];
const binaryOperators: readonly string[] = ['+', '-', '*', '/', '%', '^'];

function _isAlpha(s: string): boolean {
  return /^[a-zA-Z]$/.test(s);
}

function _isAlphanumeric(s: string): boolean {
  return /^[a-zA-Z0-9]$/.test(s);
}

function _isInt(s: string): boolean {
  return /^[0-9]$/.test(s);
}

/* function _isFloat(s: string): boolean {
  return /^[0-9]*\.?[0-9]+$/.test(s);
} */

export class Lexer {
  #position: number;
  #line: number;
  #column: number;
  #char: string | null;
  #characters: string[];
  readonly #expression: string;

  public constructor(_expr: string) {
    this.#expression = _expr;
    this.#characters = _expr.split('');
    this.#position = 0;
    this.#line = 1;
    this.#column = 1;
    this.#char = this.#characters[this.#position];
  }

  public get expression(): string {
    return this.#expression;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while(this.#char != null && this.#position < this.#characters.length) {
      const isPowerOperator = this.#char === '*' && this.#characters[this.#position + 1] === '*';

      if(ignorables.includes(this.#char)) {
        this.#processIgnorable();
      } else if(this.#char === '(') {
        tokens.push(createToken('open_paren', { location: this.#loc() }));
        this.#next();
      } else if(this.#char === ')') {
        tokens.push(createToken('close_paren', { location: this.#loc() }));
        this.#next();
      } else if(this.#char === ',') {
        tokens.push(createToken('comma', { location: this.#loc() }));
        this.#next();
      } else if(isPowerOperator || binaryOperators.includes(this.#char)) {
        tokens.push(createToken('binary_operator', {
          location: this.#loc(),
          props: { operator: isPowerOperator ? '**' : this.#char },
        }));
        this.#next(isPowerOperator ? 2 : 1);
      } else if(_isInt(this.#char) || this.#char === '.') {
        tokens.push(this.#readNumber());
      } else if(_isAlpha(this.#char)) {
        tokens.push(this.#readIdentifierOrKeyword());
      } else {
        throw new Exception(`Unrecognized character \`${this.#char}\` at line ${this.#line}, column ${this.#column}`);
      }
    }

    tokens.push(createToken('eof', { location: this.#loc() }));
    return tokens;
  }

  #processIgnorable() {
    if(this.#char === '\n' || this.#char === '\r') {
      this.#line++;
      this.#column = 1;
    } else if(this.#char === '\t') {
      this.#column += 4;
    } else if(this.#char === ' ') {
      this.#column++;
    }
    this.#next();
  }

  #readNumber(): Token {
    let numStr = '';
    const startLoc = this.#loc();

    if(this.#char === '-') {
      numStr += this.#char;
      this.#next();
    }

    while(this.#char != null && (_isInt(this.#char) || this.#char === '.')) {
      numStr += this.#char;
      this.#next();
    }

    return createToken(numStr.includes('.') ? 'decimal' : 'integer', {
      location: startLoc,
      props: { value: parseFloat(numStr) },
    });
  }

  #readIdentifierOrKeyword(): Token {
    let ident = '';
    const startLoc = this.#loc();

    while(this.#char !== null && _isAlphanumeric(this.#char)) {
      ident += this.#char;
      this.#next();
    }

    if(isConstant(ident)) return createToken('const', {
      location: startLoc,
      props: { name: ident, value: constants[ident] },
    });

    if(isFunction(ident)) return createToken('func', {
      location: startLoc,
      props: { name: ident },
    });

    throw new Exception(`Unknown identifier \`${ident}\` at line ${startLoc?.line || -1}, column ${startLoc?.column || -1}`);
  }

  #loc(): Token['location'] {
    return {
      line: this.#line,
      column: this.#column,
      position: this.#position,
    };
  }

  #next(steps: number = 1): void {
    this.#position += steps;
    this.#column += steps;
    this.#char = this.#position < this.#characters.length ? this.#characters[this.#position] : null;
  }
}

export default Lexer;
