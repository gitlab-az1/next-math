import { evaluateExpression } from './weak'; // Adjust path as needed


describe('math/parser/weak', () => {
  test('it should be ok', () => {
    expect(25 ** 0.5).toBe(5);
  });

  test('evaluates simple arithmetic expression', () => {
    const result = evaluateExpression('3 + 4 * 2');
    expect(result).toEqual({
      status: 'sucessful',
      result: 11,
      expression: '3 + 4 * 2',
    });
  });

  test('evaluates expression with functions and constants', () => {
    const result = evaluateExpression('sin(PI / 2) + cos(0)');
    expect(result).toEqual({
      status: 'sucessful',
      result: 2, // sin(PI / 2) is 1, cos(0) is 1
      expression: 'sin(PI / 2) + cos(0)',
    });
  });

  test('evaluates expression with log and ln', () => {
    const resultLog10 = evaluateExpression('log(100)');
    const resultLogBase2 = evaluateExpression('log_two(8)');
    const resultLn = evaluateExpression('ln(exp(1))');
    
    expect(resultLog10).toEqual({
      status: 'sucessful',
      result: 2, // log base 10 of 100 is 2
      expression: 'log(100)',
    });

    expect(resultLogBase2).toEqual({
      status: 'sucessful',
      result: 3, // log base 2 of 8 is 3
      expression: 'log_two(8)',
    });

    expect(resultLn).toEqual({
      status: 'sucessful',
      result: 1, // ln(exp(1)) is 1
      expression: 'ln(exp(1))',
    });
  });

  test('detects invalid characters', () => {
    const result = evaluateExpression('10 * X - 5');
    expect(result.status).toBe('failed');
    
    if(result.status === 'failed') {
      expect(result.errors[0]).toBeInstanceOf(Error);
      expect((result.errors[0] as any).message).toMatch(/Expression contains invalid characters or unsupported tokens/);
    }
  });

  test('detects unmatched parentheses - too many opening', () => {
    const result = evaluateExpression('(3 + 5');
    expect(result.status).toBe('failed');
    
    if(result.status === 'failed') {
      expect(result.errors[0]).toBeInstanceOf(Error);
      expect((result.errors[0] as any).message).toMatch(/Mismatched parentheses - too many opening parentheses/);
    }
  });

  test('detects unmatched parentheses - too many closing', () => {
    const result = evaluateExpression('3 + 5)');
    expect(result.status).toBe('failed');
    
    if(result.status === 'failed') {
      expect(result.errors[0]).toBeInstanceOf(Error);
      expect((result.errors[0] as any).message).toMatch(/Mismatched parentheses - too many closing parentheses/);
    }
  });

  test('evaluates complex expression with nested functions and parentheses', () => {
    const result = evaluateExpression('3 + abs(-5) * sin(PI / 4) - log(10) + sqrt(16)');
    
    expect(result).toEqual({
      status: 'sucessful',
      result: 3 + Math.abs(-5) * Math.sin(Math.PI / 4) - Math.log10(10) + Math.sqrt(16), // Expected result after calculation
      expression: '3 + abs(-5) * sin(PI / 4) - log(10) + sqrt(16)',
    });
  });
});
