import { Recipe } from "~~/server/models/recipe";

export default defineEventHandler(async (event) => {
	// Get id from params
	const id = event.context.params!.id;

	// Remove recipe
	try {
		await Recipe.findByIdAndDelete(id);
		return { message: "Recipe removed" };
	} catch (e :any) {
		throw createError({
			message: e.message,
		});
	}
});
