export function evaluate(formula, x) {
  switch (formula) {
    case 'crossing-primary': return x / (x * x + 1);
    case 'crossing-transfer': return 2 + (x - 3) / (x * x + 1);
    case 'crossing-alternate': return -1 + (x + 2) / (x * x + 1);
    case 'nonzero-primary': return (3 * x * x + 1) / (x * x + 1);
    case 'nonzero-transfer': return (5 * x * x + 2) / (2 * x * x + 3);
    case 'nonzero-alternate': return (4 * x * x + 3) / (2 * x * x + 1);
    case 'ends-primary': return x / Math.sqrt(x * x + 1);
    case 'ends-transfer': return 1 + 2 * x / Math.sqrt(x * x + 4);
    case 'ends-alternate': return -2 + 3 * x / Math.sqrt(x * x + 9);
    default: throw new Error('Unknown verified formula.');
  }
}
