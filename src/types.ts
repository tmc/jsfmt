// Types for the formatter

import * as acorn from 'acorn';

export interface FormatMapping {
  original: number[];
  formatted: number[];
}

export interface FormatResult {
  content: string;
  mapping: FormatMapping;
}

export type TokenOrComment = acorn.Token | acorn.Comment;

// Define the ESTree namespace to match the one used in DevTools
export namespace ESTree {
  export interface Node {
    type: string;
    start: number;
    end: number;
    parent?: Node;
    [key: string]: any;
  }

  export interface Program extends Node {
    type: 'Program';
    body: Node[];
  }

  export interface Statement extends Node {}

  export interface ExpressionStatement extends Statement {
    type: 'ExpressionStatement';
    expression: Expression;
  }

  export interface Expression extends Node {}

  export interface BlockStatement extends Statement {
    type: 'BlockStatement';
    body: Statement[];
  }

  export interface FunctionDeclaration extends Node {
    type: 'FunctionDeclaration';
    id: Identifier | null;
    params: Pattern[];
    body: BlockStatement;
  }

  export interface FunctionExpression extends Expression {
    type: 'FunctionExpression';
    id: Identifier | null;
    params: Pattern[];
    body: BlockStatement;
  }

  export interface ArrowFunctionExpression extends Expression {
    type: 'ArrowFunctionExpression';
    id: Identifier | null;
    params: Pattern[];
    body: Node;
  }

  export interface Identifier extends Node, Pattern {
    type: 'Identifier';
    name: string;
  }

  export interface IfStatement extends Statement {
    type: 'IfStatement';
    test: Expression;
    consequent: Statement;
    alternate: Statement | null;
  }

  export interface ForStatement extends Statement {
    type: 'ForStatement';
    init: Node | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
  }

  export interface ForInStatement extends Statement {
    type: 'ForInStatement';
    left: Node;
    right: Expression;
    body: Statement;
  }

  export interface ForOfStatement extends Statement {
    type: 'ForOfStatement';
    left: Node;
    right: Expression;
    body: Statement;
  }

  export interface Pattern extends Node {}

  export interface VariableDeclaration extends Statement {
    type: 'VariableDeclaration';
    declarations: VariableDeclarator[];
    kind: 'var' | 'let' | 'const';
  }

  export interface VariableDeclarator extends Node {
    type: 'VariableDeclarator';
    id: Pattern;
    init: Expression | null;
  }

  export interface CatchClause extends Node {
    type: 'CatchClause';
    param: Pattern | null;
    body: BlockStatement;
  }

  export interface TryStatement extends Statement {
    type: 'TryStatement';
    block: BlockStatement;
    handler: CatchClause | null;
    finalizer: BlockStatement | null;
  }

  export interface SwitchStatement extends Statement {
    type: 'SwitchStatement';
    discriminant: Expression;
    cases: SwitchCase[];
  }

  export interface SwitchCase extends Node {
    type: 'SwitchCase';
    test: Expression | null;
    consequent: Statement[];
  }

  export interface TemplateLiteral extends Expression {
    type: 'TemplateLiteral';
    quasis: TemplateElement[];
    expressions: Expression[];
  }

  export interface TemplateElement extends Node {
    type: 'TemplateElement';
    value: { raw: string; cooked: string };
    tail: boolean;
  }
}