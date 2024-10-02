import { Recipe } from "~~/server/models/recipe";

export default defineEventHandler(async (event) => {
	// Get data form body
	const body = await readBody(event);
	//Get id from params
	const id = event.context.params!.id;
	try {
		// Update recipe
		await Recipe.findByIdAndUpdate(id, body);
		return { message: "Recipe updated" };
	} catch (e: any) {
		throw createError({
			message: e.message,
		});
	}
});
