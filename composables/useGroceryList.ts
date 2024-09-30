import { IRecipeIngredient } from '~/types';
import { classifyIngredient } from '~/utils/ingredientClassifier';
import { GroceryItem, GroceryListDocument } from '~/server/models/groceryList';
import { Types } from 'mongoose';

export function useGroceryList() {
  const addRecipeIngredientsToGroceryList = async (ingredients: IRecipeIngredient[], recipeId?: Types.ObjectId) => {
    const groceryList = await $fetch<GroceryListDocument>('/api/grocery-list');
    let updatedItem: GroceryItem | null = null;

    for (const ingredient of ingredients) {
      const { group, keyword } = await classifyIngredient(ingredient.note);
      const existingItem = groceryList.items.find((item: { note: string; }) => item.note === ingredient.note);

      let groceryItem: GroceryItem | GroceryListDocument;

      if (existingItem) {
        existingItem.quantity += ingredient.quantity;
        groceryItem = await $fetch<GroceryItem>(`/api/grocery-list/${existingItem._id}`, {
          method: 'PUT',
          body: { updates: existingItem }
        });
        updatedItem = groceryItem;
      } else {
        groceryItem = await $fetch<GroceryItem | GroceryListDocument>('/api/grocery-list', {
          method: 'POST',
          body: {
            item: {
              note: ingredient.note,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              completed: false,
              group,
              keyword,
              recipeId
            }
          }
        });
         // Type guard to narrow down the type
         if ('items' in groceryItem) {
          // It's a GroceryListDocument
          updatedItem = groceryItem.items[groceryItem.items.length - 1];
        } else {
          // It's already a GroceryItem
          updatedItem = groceryItem;
        }
      }
    }

    return updatedItem;
  };

  return {
    addRecipeIngredientsToGroceryList,
    // ... other grocery list functions
  };
}