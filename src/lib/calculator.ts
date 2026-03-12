import { create, all, MathJsInstance } from 'mathjs';

const math = create(all) as MathJsInstance;

export interface CalculatorState {
  expression: string;
  display: string;
  result: string;
  memory: number;
  isRadians: boolean;
  error: boolean;
}

export function evaluateExpression(
  expression: string,
  isRadians: boolean
): string {
  try {
    if (!expression || expression.trim() === '') return '0';

    // Replace display symbols with math.js compatible expressions
    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/√\(/g, 'sqrt(')
      .replace(/∛\(/g, 'cbrt(')
      .replace(/log\(/g, 'log10(')
      .replace(/ln\(/g, 'log(')
      .replace(/!/g, '!');

    // Handle trig functions with degree/radian conversion
    if (!isRadians) {
      expr = expr
        .replace(/\bsin\(/g, 'sin(pi/180*')
        .replace(/\bcos\(/g, 'cos(pi/180*')
        .replace(/\btan\(/g, 'tan(pi/180*')
        .replace(/\basin\(/g, 'asin(')
        .replace(/\bacos\(/g, 'acos(')
        .replace(/\batan\(/g, 'atan(');

      // For inverse trig, convert result from radians to degrees
      // We handle asin/acos/atan separately
      const hasInverseTrig = /\basin\(|\bacos\(|\batan\(/.test(expression);
      if (hasInverseTrig) {
        // Wrap the whole expression to convert to degrees
        expr = `(${expr}) * 180 / pi`;
        // But only if it's a simple inverse trig call
        // More complex logic needed for mixed expressions
      }
    }

    const result = math.evaluate(expr);

    if (typeof result === 'number') {
      if (!isFinite(result)) return 'Error';
      if (isNaN(result)) return 'Error';
      // Format nicely
      if (Number.isInteger(result) && Math.abs(result) < 1e15) {
        return result.toString();
      }
      return parseFloat(result.toPrecision(10)).toString();
    }

    return result.toString();
  } catch {
    return 'Error';
  }
}

export function formatNumber(num: string): string {
  const n = parseFloat(num);
  if (isNaN(n)) return num;
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
  return parseFloat(n.toPrecision(10)).toString();
}
