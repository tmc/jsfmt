/**
 * Finds the indexes of all line endings in a string
 * @param content The string to find line endings in
 * @returns An array of line ending positions
 */
export function findLineEndingIndexes(content: string): number[] {
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