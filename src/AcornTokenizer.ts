import * as acorn from 'acorn';
import { TokenOrComment } from './types';

// ECMA version to use for parsing
export const ECMA_VERSION = 2022;

/**
 * A utility for working with tokens from Acorn
 */
export class AcornTokenizer {
  #tokens: Array<acorn.Comment | acorn.Token>;
  #idx = 0;
  #tokenLineStartInternal: number;
  #tokenLineEndInternal: number;

  constructor(content: string, tokens: Array<acorn.Comment | acorn.Token>) {
    this.#tokens = tokens;
    // Find line endings in the content
    const contentLineEndings = findLineEndingIndexes(content);
    this.#tokenLineStartInternal = 0;
    this.#tokenLineEndInternal = 0;
  }

  static punctuator(token: acorn.Token, values?: string): boolean {
    return token.type !== acorn.tokTypes.num && token.type !== acorn.tokTypes.regexp &&
      token.type !== acorn.tokTypes.string && token.type !== acorn.tokTypes.name && !token.type.keyword &&
      (!values || (token.type.label.length === 1 && values.indexOf(token.type.label) !== -1));
  }

  static keyword(token: acorn.Token, keyword?: string): boolean {
    return Boolean(token.type.keyword) && token.type !== acorn.tokTypes['_true'] &&
      token.type !== acorn.tokTypes['_false'] && token.type !== acorn.tokTypes['_null'] &&
      (!keyword || token.type.keyword === keyword);
  }

  static identifier(token: TokenOrComment, identifier?: string): boolean {
    return token.type === acorn.tokTypes.name && (!identifier || (token as any).value === identifier);
  }

  static arrowIdentifier(token: TokenOrComment, identifier?: string): boolean {
    return token.type === acorn.tokTypes.arrow && (!identifier || token.type.label === identifier);
  }

  static lineComment(token: TokenOrComment): boolean {
    return token.type === 'Line';
  }

  static blockComment(token: TokenOrComment): boolean {
    return token.type === 'Block';
  }

  nextToken(): TokenOrComment | null {
    const token = this.#tokens[this.#idx++];
    if (!token || token.type === acorn.tokTypes.eof) {
      return null;
    }

    this.#updateLineInfo(token);
    return token;
  }

  peekToken(): TokenOrComment | null {
    const token = this.#tokens[this.#idx];
    if (!token || token.type === acorn.tokTypes.eof) {
      return null;
    }
    return token;
  }

  tokenLineStart(): number {
    return this.#tokenLineStartInternal;
  }

  tokenLineEnd(): number {
    return this.#tokenLineEndInternal;
  }

  #updateLineInfo(token: TokenOrComment): void {
    // Simplified line info logic for standalone version
    // In a real implementation, we would use a text cursor
    // to determine the exact line number
    const lines = token.loc?.start.line ?? 0;
    this.#tokenLineStartInternal = lines;
    
    const endLines = token.loc?.end.line ?? 0;
    this.#tokenLineEndInternal = endLines;
  }
}

// Utility function to find line ending indexes in a string
function findLineEndingIndexes(content: string): number[] {
  const result: number[] = [];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n' || content[i] === '\r') {
      if (content[i] === '\r' && i + 1 < content.length && content[i + 1] === '\n') {
        i++;
      }
      result.push(i);
    }
  }
  return result;
}