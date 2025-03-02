import { format } from '../formatter';

describe('JavaScript Formatter', () => {
  it('formats await expressions correctly', () => {
    const formattedCode = format('(async () => { await someFunctionThatNeedsAwaiting(); callSomeOtherFunction(); })();');
    expect(formattedCode).toBe('(async () => {\n  await someFunctionThatNeedsAwaiting();\n  callSomeOtherFunction();\n}\n)();\n');
  });

  it('formats async-function expressions correctly', () => {
    const formattedCode = format('async function foo() {return await Promise.resolve(1);}');
    expect(formattedCode).toBe('async function foo() {\n  return await Promise.resolve(1);\n}\n');
  });

  it('formats arrow functions correctly', () => {
    const formattedCode1 = format('const double=x=>x*2;');
    const formattedCode2 = format('const sum=(a,b)=>a+b;');
    const formattedCode3 = format('const double=x=>{return x*2;}');
    const formattedCode4 = format('const sum=(a,b,c)=>{const val=a+b+c;return val;}');

    expect(formattedCode1).toBe('const double = x => x * 2;\n');
    expect(formattedCode2).toBe('const sum = (a, b) => a + b;\n');
    expect(formattedCode3).toBe('const double = x => {\n  return x * 2;\n}\n');
    expect(formattedCode4).toBe('const sum = (a, b, c) => {\n  const val = a + b + c;\n  return val;\n}\n');
  });

  it('formats if-statements correctly', () => {
    const formattedCode = format('if(a<b)log(a);else log(b);');
    expect(formattedCode).toBe('if (a < b)\n  log(a);\nelse\n  log(b);\n');
  });

  it('formats object-expressions correctly', () => {
    const formattedCode = format('var mapping={original:[1,2,3],formatted:[],count:0};');
    expect(formattedCode).toBe('var mapping = {\n  original: [1, 2, 3],\n  formatted: [],\n  count: 0\n};\n');
  });

  it('formats class declarations correctly', () => {
    const formattedCode = format('class Test{constructor(){this.bar=10;}givemebar(){return this.bar;}}');
    expect(formattedCode).toBe('class Test {\n  constructor() {\n    this.bar = 10;\n  }\n  givemebar() {\n    return this.bar;\n  }\n}\n');
  });

  it('formats template literals correctly', () => {
    const formattedCode = format('`foo${bar}foo${bar}`');
    expect(formattedCode).toBe('`foo${bar}foo${bar}`\n');
  });

  it('formats comments correctly', () => {
    const formattedCode = format('// This is a comment\nconsole.log("hello");\n/* Block comment */');
    expect(formattedCode).toBe('// This is a comment\nconsole.log("hello");\n/* Block comment */\n');
  });
});