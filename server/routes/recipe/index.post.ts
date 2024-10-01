import mongoose from "mongoose";
import { sendError, H3Event } from "h3";
import { Recipe } from "~~/server/models/recipe";
import { getServerSession } from '#auth';


export default defineEventHandler(async (event: H3Event) => {
	try {
		// Get data form body
		const body = await readBody(event);
		if (!body) {
			throw createError({ statusCode: 400, statusMessage: "Bad Request" });
		}

		const session = await getServerSession(event as any);
		if (!session || !session.user) {
			return sendError(event, createError({ statusCode: 401, message: 'Unauthorized' }));
		}
		const userId = session!.user.id

		// create recipe
		const {title, description, source, ingredients, steps, image, video_url, created_by, category, rating, url, cookingtime, yields} = body;
		const newRecipe = new Recipe({ title, description,source, image, video_url, created_by: userId, steps, ingredients, rating, category, url, cookingtime, yields});
		
		const createdRecipe = await newRecipe.save();

		return { recipe: createdRecipe };

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
