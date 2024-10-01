import mongoose from "mongoose";
import { sendError, H3Event } from "h3";
import { getServerSession } from '#auth';
import { Recipe } from "~/server/models/recipe";
import { SharedLink } from "~~/server/models/sharedLink";

const isDevelopment = process.env.NODE_ENV === 'development';

const BASE_URL = isDevelopment
  ? process.env.DEV_BASE_URL || 'http://localhost:3000'
  : process.env.PROD_BASE_URL || 'https://your-production-domain.com';


export default defineEventHandler(async (event: H3Event) => {
	try {
		// Get data form body
		const body = await readBody(event);
		
		if (!body) {
			throw createError({ statusCode: 400, statusMessage: "Bad Request" });
		}

		const session = await getServerSession(event as any);
    const { sharedLinkId, recipeId } = body;
    const recipe = await Recipe.findOne({ _id : recipeId })
    const recipeTitle = recipe?.title.replaceAll(' ', '-').toLowerCase()

  
    const newSharedLink = new SharedLink({
      _id: sharedLinkId,
      url: `${BASE_URL}/shared/recipe/${sharedLinkId}/${recipeTitle}`,
      createdBy: session?.user.id,
      recipeId,
    });
		
	  const savedLink = await newSharedLink.save();
    return savedLink;


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
