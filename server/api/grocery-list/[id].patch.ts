import { Types } from 'mongoose';
import { GroceryItem, GroceryList } from "~~/server/models/groceryList";


export default defineEventHandler(async (event) => {

	//Get id from params
  const itemId = event.context.params!.id;
  const { updates } = await readBody(event);
	try {
		 // Create an update object based on the fields sent
		 const updateFields: Partial<{ [K in `items.$.${keyof GroceryItem}`]: any }> = {};
		 if (updates.completed !== undefined) {
			 updateFields['items.$.completed'] = updates.completed;
		 }
		 if (updates.group !== undefined) {
			 updateFields['items.$.group'] = updates.group;
		 }
	
		const updatedList = await GroceryList.findOneAndUpdate(
      { 'items._id': new Types.ObjectId(itemId) },
      { $set: { 'items.$.completed': updateFields } },
      { new: true, runValidators: true },
    );

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