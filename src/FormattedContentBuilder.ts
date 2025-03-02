/**
 * Builds formatted content with proper indentation and spacing
 */
export class FormattedContentBuilder {
  #lastOriginalPosition = 0;
  #formattedContent: string[] = [];
  #formattedContentLength = 0;
  #lastFormattedPosition = 0;
  #nestingLevel = 0;
  #newLines = 0;
  #enforceSpaceBetweenWords = true;
  #softSpace = false;
  #hardSpaces = 0;
  #cachedIndents = new Map<number, string>();
  #canBeIdentifierOrNumber = /[$\u200C\u200D\p{ID_Continue}]/u;
  // List of operators that should always have spaces around them
  #specialOperators = ['instanceof', 'typeof', 'void', 'delete', 'in', 'of'];

  mapping = {original: [0], formatted: [0]};

  constructor(private indentString: string) {
  }

  setEnforceSpaceBetweenWords(value: boolean): boolean {
    const oldValue = this.#enforceSpaceBetweenWords;
    this.#enforceSpaceBetweenWords = value;
    return oldValue;
  }

  addToken(token: string, offset: number): void {
    // Special case: no space before semicolons
    if (token === ';') {
      this.#softSpace = false;
      this.#appendFormatting();
      this.#addMappingIfNeeded(offset);
      this.#addText(token);
      return;
    }
    
    // Skip the regex check if `addSoftSpace` will be a no-op.
    if (!this.#hardSpaces && !this.#softSpace) {
      const lastCharOfLastToken = this.#formattedContent.at(-1)?.at(-1) ?? '';
      
      // Check if the token is a special operator that should always have spaces
      const isSpecialOperator = this.#specialOperators.includes(token);
      
      // Check for 'return' keyword without joining the entire content
      const lastItem = this.#formattedContent.length > 0 ? this.#formattedContent[this.#formattedContent.length - 1] : '';
      const isAfterReturn = lastItem === 'return';
      
      // Check if we're after a left parenthesis
      const isAfterParen = lastCharOfLastToken === '(';
      
      // Add space between identifiers/numbers or for special operators
      // Special operators like 'instanceof' always need spaces, even in template literals
      // But don't add space after opening parenthesis
      if ((isSpecialOperator && !isAfterParen) || 
          isAfterReturn || 
          (this.#enforceSpaceBetweenWords && this.#canBeIdentifierOrNumber.test(lastCharOfLastToken) && this.#canBeIdentifierOrNumber.test(token))) {
        this.addSoftSpace();
      }
    }

    this.#appendFormatting();

    // Insert token.
    this.#addMappingIfNeeded(offset);
    this.#addText(token);
    
    // Add space after special operators - always, regardless of enforceSpaceBetweenWords
    // This ensures operators like 'instanceof' always have spaces even in template literals
    if (this.#specialOperators.includes(token)) {
      this.addSoftSpace();
    }
  }

  addSoftSpace(): void {
    if (!this.#hardSpaces) {
      this.#softSpace = true;
    }
  }

  addHardSpace(): void {
    this.#softSpace = false;
    ++this.#hardSpaces;
  }

  addNewLine(noSquash?: boolean): void {
    // Avoid leading newlines.
    if (!this.#formattedContentLength) {
      return;
    }
    if (noSquash) {
      ++this.#newLines;
    } else {
      this.#newLines = this.#newLines || 1;
    }
  }

  increaseNestingLevel(): void {
    this.#nestingLevel += 1;
  }

  decreaseNestingLevel(): void {
    if (this.#nestingLevel > 0) {
      this.#nestingLevel -= 1;
    }
  }

  content(): string {
    return this.#formattedContent.join('') + (this.#newLines ? '\n' : '');
  }

  #appendFormatting(): void {
    if (this.#newLines) {
      for (let i = 0; i < this.#newLines; ++i) {
        this.#addText('\n');
      }
      this.#addText(this.#indent());
    } else if (this.#softSpace) {
      this.#addText(' ');
    }
    if (this.#hardSpaces) {
      for (let i = 0; i < this.#hardSpaces; ++i) {
        this.#addText(' ');
      }
    }
    this.#newLines = 0;
    this.#softSpace = false;
    this.#hardSpaces = 0;
  }

  #indent(): string {
    const cachedValue = this.#cachedIndents.get(this.#nestingLevel);
    if (cachedValue) {
      return cachedValue;
    }

    let fullIndent = '';
    for (let i = 0; i < this.#nestingLevel; ++i) {
      fullIndent += this.indentString;
    }

    // Cache a maximum of 20 nesting level indents.
    if (this.#nestingLevel <= 20) {
      this.#cachedIndents.set(this.#nestingLevel, fullIndent);
    }
    return fullIndent;
  }

  #addText(text: string): void {
    this.#formattedContent.push(text);
    this.#formattedContentLength += text.length;
  }

  #addMappingIfNeeded(originalPosition: number): void {
    if (originalPosition - this.#lastOriginalPosition === this.#formattedContentLength - this.#lastFormattedPosition) {
      return;
    }
    this.mapping.original.push(originalPosition);
    this.#lastOriginalPosition = originalPosition;
    this.mapping.formatted.push(this.#formattedContentLength);
    this.#lastFormattedPosition = this.#formattedContentLength;
  }
}