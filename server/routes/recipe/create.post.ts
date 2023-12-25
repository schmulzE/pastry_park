import { Recipe } from "~~/server/models/recipe";
import { sendError, H3Event, } from "h3";


export default defineEventHandler(async (event: H3Event) => {
	try {
		// Get data form body
		const body = await readBody(event);

		if (!body) {
			return sendError(event, createError({ statusCode: 400, data: 'Item field is required.' }))
		}

			// create recipe
		await Recipe.create(body);
		return { message: "recipe created" };
	} catch (e: any) {
		throw createError({
			message: e.message,
		});
	}
});
