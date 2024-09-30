import { Types } from 'mongoose';
import { GroceryItem, GroceryList } from "~~/server/models/groceryList";


export default defineEventHandler(async (event) => {

	//Get id from params
  const itemId = event.context.params!.id;
  const { updates } = await readBody(event);
	try {
		// Create an object with the fields to update
		 const updateFields = Object.keys(updates).reduce((acc, key) => {
      acc[`items.$.${key}` as keyof typeof acc] = updates[key as keyof GroceryItem]
      return acc
    }, {} as Record<string, unknown>)

		// console.log(updateFields)

		const updatedList = await GroceryList.findOneAndUpdate(
			{ 'items._id': new Types.ObjectId(itemId) },
			{ $set: updateFields },
			{ new: true, runValidators: true }
		)	

		if (!updatedList) {
      return createError({
        statusCode: 404,
        message: 'Grocery list item not found',
      })
    }

		if (!updatedList) {
      throw createError({
        statusCode: 404,
        message: 'Grocery list item not found',
      });
    }

		return { message: "item updated" };

	} catch (e: any) {
		throw createError({
			message: e.message,
		});
	}
});



