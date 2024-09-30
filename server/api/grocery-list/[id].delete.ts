import { GroceryList } from "~~/server/models/groceryList";

export default defineEventHandler(async (event) => {
  const { recipeId } = getQuery(event);
  const itemId = event.context.params?.id;

  try {
    if (recipeId) {
      return await deleteByRecipeId(recipeId as string);
    } else if (itemId) {
      return await deleteByItemId(itemId);
    } else {
      return await deleteCompletedItems();
    }
  } catch (error) {
    console.error('Error deleting grocery item(s):', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Error deleting grocery item(s)',
    });
  }
});

async function deleteByRecipeId(recipeId: string) {
  await GroceryList.updateMany(
    { 'items.recipeId': recipeId },
    { $pull: { items: { recipeId } } }
  );
  return {
    statusCode: 200,
    body: { message: `Deleted all items with recipe ID: ${recipeId}` },
  };
}

async function deleteByItemId(itemId: string) {
  const updatedList = await GroceryList.findOneAndUpdate(
    { 'items._id': itemId },
    { $pull: { items: { _id: itemId } } },
    { new: true }
  );

  if (!updatedList) {
    throw createError({
      statusCode: 404,
      message: 'Grocery list item not found',
    });
  }

  return {
    statusCode: 200,
    body: { message: `Deleted item with ID: ${itemId}` },
  };
}

async function deleteCompletedItems() {
  const result = await GroceryList.updateMany(
    {},
    { $pull: { items: { completed: true } } }
  );

  if (result.modifiedCount === 0) {
    throw createError({
      statusCode: 404,
      message: 'No completed items found to delete',
    });
  }

  return {
    statusCode: 200,
    body: { message: `Deleted ${result.modifiedCount} completed items` },
  };
}