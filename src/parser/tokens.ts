import type { Dict } from '../_internals/types';


export type TokenKind = 
  | 'numeric'
  | 'integer'
  | 'decimal'
  | 'bool'
  | 'text'
  | 'func'
  | 'const'
  | 'eof'
  | 'equals'
  | 'open_paren'
  | 'close_paren'
  | 'open_brace'
  | 'close_brace'
  | 'open_bracket'
  | 'close_bracket'
  | 'binary_operator'
  | 'if'
  | 'else'
  | 'elif'
  | 'semicol'
  | 'dot'
  | 'comma';


const specialTokens: Dict<string> = {
  equals: '==',
  open_paren: '(',
  close_paren: ')',
  open_brace: '[',
  close_brace: ']',
  open_bracket: '{',
  close_bracket: '}',
  if: 'if',
  else: 'else',
  elif: 'elif',
  semicol: ';',
  comma: ',',
  dot: '.',
};

const functionProps: Dict<{ params: FunctionParameter[]; returnType: TokenKind; name: string }> = {
  sin: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'sin',
  },
  cos: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'cos',
  },
  tan: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'tan',
  },
  asin: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'asin',
  },
  acos: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'acos',
  },
  atan: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'atan',
  },
  abs: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'abs',
  },
  sqrt: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'sqrt',
  },
  exp: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'exp',
  },
  ln: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'ln',
  },
  log2: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'log2',
  },
  log10: {
    params: [ { name: 'x', type: 'numeric', optional: false } ],
    returnType: 'numeric',
    name: 'log10',
  },
  log: {
    returnType: 'numeric',
    name: 'log',
    params: [
      {
        name: 'x',
        type: 'numeric',
        optional: false,
      },
      {
        name: 'base',
        type: 'numeric',
        optional: true,
      },
    ],
  },
};


export interface Token {
  kind: TokenKind;
  location?: {
    line: number;
    column: number;
    position: number;
  };
}

export interface NumericToken extends Token {
  kind: 'numeric';
  value: number;
}

export interface IntegerToken extends Token {
  kind: 'integer';
  value: number;
}

export interface DecimalToken extends Token {
  kind: 'decimal';
  value: number;
}

export interface BooleanToken extends Token {
  kind: 'bool';
  value: boolean;
}

export interface TextToken extends Token {
  kind: 'text';
  value: string;
}


export type FunctionParameter = {
  name: string;
  type: TokenKind;
  optional: boolean;
};

export interface FunctionToken extends Token {
  kind: 'func';
  name: string;
  params: readonly FunctionParameter[];
  returnType: TokenKind;
}

export interface ConstantToken extends Token {
  kind: 'const';
  name: string;
  value: number;
}

export interface EqualsToken extends Token {
  kind: 'equals';
  operator: string;
}

export interface OpenParenToken extends Token {
  kind: 'open_paren';
  operator: string;
}

export interface CloseParenToken extends Token {
  kind: 'close_paren';
  operator: string;
}

export interface OpenBraceToken extends Token {
  kind: 'open_brace';
  operator: string;
}

export interface CloseBraceToken extends Token {
  kind: 'close_brace';
  operator: string;
}

export interface OpenBracketToken extends Token {
  kind: 'open_bracket';
  operator: string;
}

export interface CloseBracketToken extends Token {
  kind: 'close_bracket';
  operator: string;
}

export interface BinaryOperatorToken extends Token {
  kind: 'binary_operator';
  operator: string;
}

export interface IfToken extends Token {
  kind: 'if';
  operator: string;
}

export interface ElseToken extends Token {
  kind: 'else';
  operator: string;
}

export interface ElseIfToken extends Token {
  kind: 'elif';
  operator: string;
}

export interface SemiColonToken extends Token {
  kind: 'semicol';
  operator: string;
}

export interface CommaToken extends Token {
  kind: 'comma';
  operator: string;
}

export interface DotToken extends Token {
  kind: 'dot';
  operator: string;
}

export interface EndOfFileToken extends Token {
  kind: 'eof';
}


type TokenParams<K extends TokenKind> = K extends 'numeric' | 'integer' | 'decimal' ?
  { value: number } :
  K extends 'bool' ?
  { value: boolean } :
  K extends 'text' ?
  { value: string } :
  K extends 'func' ?
  { name: string; params: FunctionParameter[]; returnType: TokenKind } :
  K extends 'const' ?
  { name: string; value: number } :
  K extends 'binary_operator' ?
  { operator: string } :
  never;

export function createToken<K extends TokenKind>(kind: K, props?: { location?: Token['location']; props?: Partial<TokenParams<K>> }): Token {
  if(kind in specialTokens) return {
    operator: specialTokens[kind],
    location: props?.location,
    ...props?.props,
    kind,
  } as any;

  if(kind === 'func') return {
    location: props?.location,
    ...(functionProps[(props?.props as any)?.name] || {}),
    ...props?.props,
    kind,
  };

  return {
    location: props?.location,
    ...props?.props,
    kind,
  };
}
