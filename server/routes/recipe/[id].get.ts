import { Recipe } from "~~/server/models/recipe";

export default defineEventHandler(async (event) => {
	//Get slug from params
	const id = event.context.params!.id;
	
	try {
		let data = await Recipe.findOne({ _id: id});
		return data
	} catch (e: any) {
		throw createError({
			message: e.message,
		});
	}
});
