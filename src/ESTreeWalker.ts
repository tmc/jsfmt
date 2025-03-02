import { ESTree } from './types';

/**
 * Walks an ESTree and calls provided callbacks for each node
 */
export class ESTreeWalker {
  readonly #beforeVisit: (arg0: ESTree.Node) => unknown;
  readonly #afterVisit: (arg0: ESTree.Node) => unknown;

  constructor(beforeVisit: (arg0: ESTree.Node) => unknown, afterVisit: ((arg0: ESTree.Node) => unknown)) {
    this.#beforeVisit = beforeVisit;
    this.#afterVisit = afterVisit;
  }

  walk(ast: ESTree.Node): void {
    this.#innerWalk(ast, null);
  }

  #innerWalk(node: ESTree.Node, parent: ESTree.Node | null): void {
    if (!node) {
      return;
    }
    node.parent = parent as ESTree.Node;

    this.#beforeVisit.call(null, node);

    const walkOrder = WALK_ORDER[node.type];
    if (!walkOrder) {
      console.error('Walk order not defined for ' + node.type);
      return;
    }

    if (node.type === 'TemplateLiteral') {
      const templateLiteral = (node as ESTree.TemplateLiteral);
      const expressionsLength = templateLiteral.expressions.length;
      for (let i = 0; i < expressionsLength; ++i) {
        this.#innerWalk(templateLiteral.quasis[i], templateLiteral);
        this.#innerWalk(templateLiteral.expressions[i], templateLiteral);
      }
      this.#innerWalk(templateLiteral.quasis[expressionsLength], templateLiteral);
    } else {
      for (let i = 0; i < walkOrder.length; ++i) {
        const property = walkOrder[i];
        const entity = (node as any)[property];
        if (Array.isArray(entity)) {
          this.#walkArray(entity as ESTree.Node[], node);
        } else {
          this.#innerWalk(entity as ESTree.Node, node);
        }
      }
    }

    this.#afterVisit.call(null, node);
  }

  #walkArray(nodeArray: ESTree.Node[], parentNode: ESTree.Node | null): void {
    for (let i = 0; i < nodeArray.length; ++i) {
      this.#innerWalk(nodeArray[i], parentNode);
    }
  }
}

// Defines the order in which to walk node properties
const WALK_ORDER: Record<string, string[]> = {
  AwaitExpression: ['argument'],
  ArrayExpression: ['elements'],
  ArrayPattern: ['elements'],
  ArrowFunctionExpression: ['params', 'body'],
  AssignmentExpression: ['left', 'right'],
  AssignmentPattern: ['left', 'right'],
  BinaryExpression: ['left', 'right'],
  BlockStatement: ['body'],
  BreakStatement: ['label'],
  CallExpression: ['callee', 'arguments'],
  CatchClause: ['param', 'body'],
  ClassBody: ['body'],
  ClassDeclaration: ['id', 'superClass', 'body'],
  ClassExpression: ['id', 'superClass', 'body'],
  ChainExpression: ['expression'],
  ConditionalExpression: ['test', 'consequent', 'alternate'],
  ContinueStatement: ['label'],
  DebuggerStatement: [],
  DoWhileStatement: ['body', 'test'],
  EmptyStatement: [],
  ExpressionStatement: ['expression'],
  ForInStatement: ['left', 'right', 'body'],
  ForOfStatement: ['left', 'right', 'body'],
  ForStatement: ['init', 'test', 'update', 'body'],
  FunctionDeclaration: ['id', 'params', 'body'],
  FunctionExpression: ['id', 'params', 'body'],
  Identifier: [],
  ImportDeclaration: ['specifiers', 'source'],
  ImportDefaultSpecifier: ['local'],
  ImportNamespaceSpecifier: ['local'],
  ImportSpecifier: ['imported', 'local'],
  ImportExpression: ['source'],
  ExportAllDeclaration: ['source'],
  ExportDefaultDeclaration: ['declaration'],
  ExportNamedDeclaration: ['specifiers', 'source', 'declaration'],
  ExportSpecifier: ['exported', 'local'],
  IfStatement: ['test', 'consequent', 'alternate'],
  LabeledStatement: ['label', 'body'],
  Literal: [],
  LogicalExpression: ['left', 'right'],
  MemberExpression: ['object', 'property'],
  MetaProperty: ['meta', 'property'],
  MethodDefinition: ['key', 'value'],
  NewExpression: ['callee', 'arguments'],
  ObjectExpression: ['properties'],
  ObjectPattern: ['properties'],
  ParenthesizedExpression: ['expression'],
  PrivateIdentifier: [],
  PropertyDefinition: ['key', 'value'],
  Program: ['body'],
  Property: ['key', 'value'],
  RestElement: ['argument'],
  ReturnStatement: ['argument'],
  SequenceExpression: ['expressions'],
  SpreadElement: ['argument'],
  StaticBlock: ['body'],
  Super: [],
  SwitchCase: ['test', 'consequent'],
  SwitchStatement: ['discriminant', 'cases'],
  TaggedTemplateExpression: ['tag', 'quasi'],
  TemplateElement: [],
  TemplateLiteral: ['quasis', 'expressions'],
  ThisExpression: [],
  ThrowStatement: ['argument'],
  TryStatement: ['block', 'handler', 'finalizer'],
  UnaryExpression: ['argument'],
  UpdateExpression: ['argument'],
  VariableDeclaration: ['declarations'],
  VariableDeclarator: ['id', 'init'],
  WhileStatement: ['test', 'body'],
  WithStatement: ['object', 'body'],
  YieldExpression: ['argument'],
};