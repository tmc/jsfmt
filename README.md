# jsfmt

JavaScript formatter based on Chrome DevTools' formatter

## Description

This is a standalone JavaScript formatter that matches the style used by Chrome DevTools. The formatter preserves the semantics of your code while applying consistent formatting according to a style similar to StandardJS, but with some subtle differences as seen in DevTools.

## Installation

```bash
npm install jsfmt
```

## Usage

### Command Line

```bash
# Format a file and print to stdout
jsfmt path/to/file.js

# Format a file and write the result back to the file
jsfmt -w path/to/file.js

# Format a file with a specific indentation (default is 2 spaces)
jsfmt -i 4 path/to/file.js

# Format from stdin
cat path/to/file.js | jsfmt
```

### API

```javascript
const { format, formatWithMapping } = require('jsfmt');

// Format a string of JavaScript
const formattedCode = format('function example() { return 42; }');
console.log(formattedCode);
// Output:
// function example() {
//   return 42;
// }
//

// Format with custom indentation (4 spaces instead of the default 2)
const formattedWithCustomIndent = format('function example() { return 42; }', '    ');

// Get formatting with position mapping
const result = formatWithMapping('function example() { return 42; }');
console.log(result.content); // The formatted code
console.log(result.mapping); // Object with original and formatted position mappings
```

## Features

- Modern JavaScript support (up to ECMAScript 2022)
- Formats comments and preserves whitespace where appropriate
- Handles complex JavaScript constructs like:
  - Classes and class fields
  - Arrow functions
  - Template literals
  - Destructuring
  - Async/await
  - Import/export statements
- Provides source position mapping for tooling integration
- Customizable indentation

## License

This project is licensed under the BSD-3-Clause license, the same as Chromium.