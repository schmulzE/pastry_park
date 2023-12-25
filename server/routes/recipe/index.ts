import { Recipe } from "~~/server/models/recipe";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineEventHandler(async (event) => {
    try {
        // return all recipe
        const data = await Recipe.find().sort('-createdAt')
        return data
    } catch (error: unknown) {
        return createError({ statusCode: 500, statusMessage: 'Something went wrong.' })
    }
});
