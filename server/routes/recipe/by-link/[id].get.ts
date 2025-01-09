import { Recipe } from '~/server/models/recipe';  // Adjust this import based on your actual model location

export default defineEventHandler(async (event) => {
  const linkId = event.context.params?.id;


  if (!linkId) {
    throw createError({
      statusCode: 400,
      message: 'shared link is required'
    })
  }

  try {
    const recipe = await Recipe.findOne({ _id: linkId })

    if (!recipe) {
      throw createError({
        statusCode: 404,
        message: 'Recipe not found'
      })
    }

    return recipe;

  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching recipe'
    })
  }
})