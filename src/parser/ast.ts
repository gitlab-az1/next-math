export type NodeType = 
  | 'NumericLiteral'
  | 'BinaryExpression'
  | 'UnaryExpression'
  | 'CallExpression'
  | 'ConstantAssignment';


export interface Statement {
  kind: NodeType;
}

export interface Expression extends Statement { }


export interface NumericLiteralExpression extends Expression {
  kind: 'NumericLiteral';
  value: number;
}

export interface BinaryExpression extends Expression {
  kind: 'BinaryExpression';
  operator: string;
  left: Expression;
  right: Expression;
}

export interface UnaryExpression extends Expression {
  kind: 'UnaryExpression';
  operator: string;
  expression: Expression;
}

export interface CallExpression extends Expression {
  kind: 'CallExpression';
  name: string;
  arguments: Expression[];
}

export interface ConstantAssignmentExpression extends Expression {
  kind: 'ConstantAssignment';
  name: string;
  value: number;
}
