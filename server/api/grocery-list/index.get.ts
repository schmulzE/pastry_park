import { getServerSession } from '#auth';
import { GroceryList } from "~~/server/models/groceryList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineEventHandler(async (event) => {
	try {
		const session = await getServerSession(event as any);
		if (!session || !session.user) {
			return sendError(event, createError({ statusCode: 401, message: 'Unauthorized' }));
		}
		const userId = session!.user.id
		const data = await GroceryList.findOne({ userId });

		return data
	} catch (error) {
		if (error instanceof Error) {
			sendError(event, createError({ ...error, message: error.message }));
		}
	}

});
