import { Recipe } from "~~/server/models/recipe";
import { getServerSession } from '#auth';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineEventHandler(async (event) => {
	try {
		const session = await getServerSession(event as any);
		if (!session || !session.user) {
			return sendError(event, createError({ statusCode: 401, message: 'Unauthorized' }));
		}
		const userId = session!.user.id
		// return all recipe
		const data = await Recipe.find({ created_by: userId }).sort('-createdAt');

		return data
	} catch (error) {
		if (error instanceof Error) {
			sendError(event, createError({ ...error, message: error.message }));
		}
	}
});
