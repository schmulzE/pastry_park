import mongoose from "mongoose";
import { sendError, H3Event, } from "h3";
import { getServerSession } from '#auth';
// import { Recipe } from "~~/server/models/recipe";
import { GroceryList } from "~~/server/models/groceryList";


export default defineEventHandler(async (event: H3Event) => {
	try {
		// Get data form body
		const body = await readBody(event);
		const session = await getServerSession(event as any);
		const userId = session?.user.id

		if (!body) {
			throw createError({ statusCode: 400, statusMessage: "Bad Request" });
		}
		
		const { item } = body;
		let groceryList = await GroceryList.findOne({ userId });
		if (!groceryList) {
			// If no grocery list exists, create a new one
			groceryList = new GroceryList({ userId, items: [] });
		}
		
		groceryList?.items.push(item);
		return await groceryList?.save();

	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			// Handle validation errors
			const validationErrors = Object.values(error.errors).map(err => err.message);
			sendError(event, createError({ statusCode: 400, data: validationErrors }));
		} else if (error instanceof Error) {
			sendError(event, createError({ ...error, message: error.message }));
		}
	}
});