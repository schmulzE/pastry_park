import mongoose from "mongoose";
import { SharedLink } from "~~/server/models/sharedLink";


export default defineEventHandler(async (event) => {
	// Get id from params
	const id = event.context.params!.id;

	// Remove link
	try {
		await SharedLink.findByIdAndDelete({ _id : id });
		
		return { message: "Link destroyed" };

	} catch (error :any) {
		if (error instanceof mongoose.Error.ValidationError) {
			// Handle validation errors
			const validationErrors = Object.values(error.errors).map(err => err.message);
			sendError(event, createError({ statusCode: 400, data: validationErrors }));
		} else if (error instanceof Error) {
			sendError(event, createError({ ...error, message: error.message }));
		} else {
      sendError(event, createError({ statusCode: 500, message: 'An unexpected error occurred' }));
    }
	}
});
