import { findLineEndingIndexes } from './utils';
import { FormattedContentBuilder } from './FormattedContentBuilder';
import { JavaScriptFormatter } from './JavaScriptFormatter';
import { FormatResult } from './types';

/**
 * Format JavaScript code
 * @param text The JavaScript code to format
 * @param indentString The string to use for indentation (defaults to 4 spaces)
 * @returns The formatted JavaScript code
 */
export function format(text: string, indentString: string = '  '): string {
  const result = formatWithMapping(text, indentString);
  return result.content;
}

/**
 * Format JavaScript code and return both the formatted text and source mapping
 * @param text The JavaScript code to format
 * @param indentString The string to use for indentation (defaults to 2 spaces)
 * @returns An object with the formatted content and source mapping
 */
export function formatWithMapping(text: string, indentString: string = '  '): FormatResult {
  // Default to a 2-space indent
  const builder = new FormattedContentBuilder(indentString);
  const lineEndings = findLineEndingIndexes(text);

  try {
    const formatter = new JavaScriptFormatter(builder);
    formatter.format(text, lineEndings, 0, text.length);
    
    return {
      mapping: builder.mapping,
      content: builder.content(),
    };
  } catch (e) {
    console.error('Error formatting JavaScript:', e);
    return {
      mapping: { original: [0], formatted: [0] },
      content: text,
    };
  }
}