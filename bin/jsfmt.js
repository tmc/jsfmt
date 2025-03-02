#!/usr/bin/env node

// Simple CLI entry point for jsfmt
const { program } = require('commander');
const fs = require('fs');
const { format } = require('../dist');

program
  .name('jsfmt')
  .description('JavaScript formatter based on Chrome DevTools formatter')
  .version(require('../package.json').version)
  .arguments('[input] [output]')
  .usage('[options] [input] [output]')
  .option('-i, --indent <spaces>', 'number of spaces for indentation (default: 4)', '4')
  .option('-w, --write', 'write output back to the input file')
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ jsfmt file.js                # Format file.js and print to stdout');
    console.log('  $ jsfmt file.js -w             # Format file.js and overwrite it');
    console.log('  $ jsfmt file.js output.js      # Format file.js and save to output.js');
    console.log('  $ jsfmt file.js -i 2           # Format with 2-space indentation');
    console.log('  $ cat file.js | jsfmt          # Format from stdin and print to stdout');
    console.log('  $ cat file.js | jsfmt > out.js # Format from stdin and save to out.js');
  })
  .parse(process.argv);

const options = program.opts();
const args = program.args;

// Handle input/output
async function main() {
  try {
    let inputFile = args[0];
    let outputFile = args[1];
    let source;
    
    // Determine input source
    if (inputFile) {
      // Read from file
      source = fs.readFileSync(inputFile, 'utf8');
    } else {
      // Read from stdin
      source = fs.readFileSync(0, 'utf8');
    }
    
    // Create indentation string
    const indentSize = parseInt(options.indent);
    const indentString = ' '.repeat(indentSize);
    
    // Format the code
    const formattedSource = format(source, indentString);
    
    // Determine output destination
    if (options.write && inputFile) {
      // Write back to input file
      fs.writeFileSync(inputFile, formattedSource);
      console.error(`Formatted ${inputFile} (${indentSize}-space indentation)`);
    } else if (outputFile) {
      // Write to output file
      fs.writeFileSync(outputFile, formattedSource);
      console.error(`Formatted ${inputFile} to ${outputFile} (${indentSize}-space indentation)`);
    } else {
      // Write to stdout
      process.stdout.write(formattedSource);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});