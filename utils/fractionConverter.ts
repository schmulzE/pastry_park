export function convertToFraction(input: string | null): string {
  if (!input) {
    return '';
  }

  const fractionMap: { [key: string]: string } = {
    '1/4': '¼', '1/2': '½', '3/4': '¾',
    '1/3': '⅓', '2/3': '⅔',
    '1/5': '⅕', '2/5': '⅖', '3/5': '⅗', '4/5': '⅘',
    '1/6': '⅙', '5/6': '⅚',
    '1/8': '⅛', '3/8': '⅜', '5/8': '⅝', '7/8': '⅞'
  };

  function improperToMixed(numerator: number, denominator: number): [number, number, number] {
    const wholePart = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    return [wholePart, remainder, denominator];
  }

  // Handle mixed fractions
  const mixedMatch = input.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const [_, whole, numerator, denominator] = mixedMatch.map(Number);
    const improperNumerator = whole * denominator + numerator;
    return convertToFraction(`${improperNumerator}/${denominator}`);
  }

  // Handle simple fractions
  if (fractionMap[input]) {
    return fractionMap[input];
  }

  const fractionMatch = input.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const [_, numerator, denominator] = fractionMatch.map(Number);
    const [whole, remainder, newDenominator] = improperToMixed(numerator, denominator);
    if (whole > 0) {
      const fractionPart = remainder === 0 ? '' : convertToFraction(`${remainder}/${newDenominator}`);
      return `${whole}${fractionPart}`;
    }
  }

  // Handle decimal numbers
  const decimal = parseFloat(input);
  if (!isNaN(decimal)) {
    // Handle whole numbers
    if (Number.isInteger(decimal)) {
      return decimal.toString();
    }
    
    // Convert decimal to mixed number if it's greater than 1
    if (decimal > 1) {
      const whole = Math.floor(decimal);
      const fractionalPart = decimal - whole;
      let closestFraction = input; // default to input if no fraction is close enough
      let smallestDifference = Number.MAX_VALUE;

      for (const [fraction, unicode] of Object.entries(fractionMap)) {
        const [numerator, denominator] = fraction.split('/').map(Number);
        const difference = Math.abs(fractionalPart - numerator / denominator);
        
        if (difference < smallestDifference) {
          smallestDifference = difference;
          closestFraction = `${whole}${unicode}`;
        }
      }

      return closestFraction;
    }
    
    // Handle decimals less than 1
    let smallestDifference = Number.MAX_VALUE;
    let closestFraction = input;

    for (const [fraction, unicode] of Object.entries(fractionMap)) {
      const [numerator, denominator] = fraction.split('/').map(Number);
      const difference = Math.abs(decimal - numerator / denominator);

      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestFraction = unicode;
      }
    }

    return closestFraction;
  }

  return input;
}