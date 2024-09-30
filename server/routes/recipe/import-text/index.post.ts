// import { parse } from "vue/compiler-sfc";
import { v4 as uuidv4 } from 'uuid';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { text } : {text: string} = body
    try {

      function parseIngredients(ingredients: string[]) {
        const allowedUnits = new Set([
        'cup', 'cups', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'piece', 'pieces', 'slices', 'slice', 'pinch', 'pinches', 'dash',
        'quart', 'quarts', 'teaspoon', 'tablespoons', 'teaspoons', 'ounce' ,'ounces']);
        return ingredients.map(ingredient => {
          if (!ingredient.match(/^\d/)) {
            return {
              amount: null,
              unit: null,
              note: ingredient
            };
          }
          const [amount, unit, ...rest] = ingredient.split(' ');
          const note = rest.join(' ');
          const parsedUnit = unit.replace(',', '').toLowerCase();

      
          if (!allowedUnits.has(parsedUnit)) {
            return {
              amount: amount,
              unit: null,
              note: parsedUnit + note
            };
          }
      
          return {
            amount: amount,
            unit: parsedUnit,
            note
          };
        });
      }

      function convertTimeToObj(time: string) {
        // Remove any non-digit characters from the input string
        let cleanedTime: string | string[];
        if(time.includes('-')){
         cleanedTime = time.split('-');
        }else{
          cleanedTime = time.replace(/\D/g, '');
        }
      
        // Check if the cleaned string is empty
        if (!cleanedTime) {
          return { hours: 0, minutes: 0 };
        }
      
        // If the cleaned string is a single number, assume it's minutes
        if (/^\d+$/.test(cleanedTime as string)) {
          const minutes = parseInt(cleanedTime as string, 10);
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          return { hours, minutes: remainingMinutes };
        }
      
        // If the cleaned string contains a hyphen, assume it's a range
        if (cleanedTime.length === 2) {
          const minutes = parseInt(cleanedTime[1].trim());
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          return { hours, minutes: remainingMinutes };
        }
      
        // If the input doesn't match any expected format, return 0 for hours and minutes
        return { hours: 0, minutes: 0 };
      }

      function getCookingTime (cookingtime: string, preptime: string, totaltime: string) {
        let result = []
        let prep = convertTimeToObj(cookingtime);
        let cook = convertTimeToObj(preptime);
        let total = convertTimeToObj(totaltime);

        result = [
          {id: uuidv4(), title: 'prep', hours: prep.hours, minutes: prep.minutes},
          {id: uuidv4(), title: 'cook', hours: cook.hours, minutes: cook.minutes},
          {id: uuidv4(), title: 'total', hours: total.hours, minutes: total.minutes}
        ];

        return result;
      };

    function extractRecipeDetails(recipeText: string) {
      // Split the recipe text into lines
      const lines = recipeText.split('\n');
    
      // Extract the recipe title
      const title = lines.find(line => line.trim() !== '');
    
      // Extract the description
      let descriptionStartIndex = lines.findIndex((line, index) => index > 0 && line.trim() !== '');
      const descriptionEndIndex = lines.findIndex((line, index) => index > descriptionStartIndex && line.trim() === '');
      const description = lines.slice(descriptionStartIndex, descriptionEndIndex).join(' ').trim();
    
    
      // Extract the prep time, cook time, total time, and servings
      const prepTimeIndex = lines.findIndex(line => line.trim().toLowerCase().includes('prep time'));
      const cookTimeIndex = lines.findIndex(line => line.trim().toLowerCase().includes('cook time'));
      const totalTimeIndex = lines.findIndex(line => line.trim().toLowerCase().includes('total time'));
      const servingsIndex = lines.findIndex(line => line.trim().toLowerCase().includes('servings'));
      const prepTime = lines[prepTimeIndex]?.split(':')[1]?.trim();
      const cookTime = lines[cookTimeIndex]?.split(':')[1]?.trim();
      const totalTime = lines[totalTimeIndex]?.split(':')[1]?.trim();
      const servings = lines[servingsIndex]?.split(':')[1]?.trim();
    
      // Extract the ingredients
      const ingredientsStartIndex = lines.findIndex(line => line.trim().toLowerCase() === 'ingredients');
      const ingredientsEndIndex = lines.findIndex((line, index) => index > ingredientsStartIndex && line.trim().toLowerCase().includes('instructions') ||  line.trim().toLowerCase().includes('steps'));
      const ingredients = lines.slice(ingredientsStartIndex + 1, ingredientsEndIndex).filter(line => line.trim() !== '');
    
      // Extract the instructions
      const instructionsStartIndex = lines.findIndex(line => line.trim().toLowerCase() === 'instructions');
      const instructions = lines.slice(instructionsStartIndex + 1).filter(line => line.trim() !== '');

      let cookingtime = getCookingTime(prepTime, cookTime, totalTime)
      let parsedIngredients = parseIngredients(ingredients)
      return {
        title,
        description,
        cookingtime,
        parsedIngredients,
        servings,
        instructions,
      };
    }

    const recipe = extractRecipeDetails(text)
    console.log('recipe',recipe);
    return { recipe };

    }catch(error) {
      return createError({ statusCode: 500, statusMessage: 'Something went wrong.' })
    }
  })