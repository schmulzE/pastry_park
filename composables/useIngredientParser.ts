import { v4 as uuidv4 } from 'uuid';

export function useIngredientParser() {
  function parseIngredients(ingredients: string[]) {
    const parsedIngredients: { id: string; quantity: string | null; unit: string | null; note: string }[] = [];
    const amountRegex = /^((?:\d+\s*)?(?:\d*\.\d+|\d*[\u00BC-\u00BE\u2150-\u215E\d\/]*))\s*/;

    for (const ingredient of ingredients) {
      if (!ingredient.match(/^\d|[\u00BC-\u00BE\u2150-\u215E]/)) {
        parsedIngredients.push({ id: uuidv4(), quantity: null, unit: null, note: ingredient });
      } else {
        const amountMatch = ingredient.match(amountRegex);
        const quantity = amountMatch ? amountMatch[1].replace(/\s+/g, '') : null;
        
        const remainder = ingredient.replace(amountRegex, '').trim();
        const parentheticalUnitMatch = remainder.match(/^\((.*?)\)/);
        const parentheticalUnit = parentheticalUnitMatch ? parentheticalUnitMatch[0].toLowerCase() : null;
        
        const rest = remainder.replace(parentheticalUnitMatch ? parentheticalUnitMatch[0] : '', '').trim().split(' ');

        const unit = parentheticalUnit || rest[0];
        const note = parentheticalUnit ? rest.join(' ') : rest.slice(1).join(' ');
        
        parsedIngredients.push({ id: uuidv4(), quantity, unit, note });
      }
    }
    
    return parsedIngredients;
  }

  return {
    parseIngredients
  };
}