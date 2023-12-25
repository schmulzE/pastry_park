import { Recipe } from "~~/server/models/recipe";

export default defineEventHandler(async(event) => {
  const body = await readBody(event)
  const { query } = body
  try{
    const result = await Recipe.aggregate([
      {
        '$search': {
          'index': 'searchRecipe',
          'text': {
            'query': query,
            'path': {
              'wildcard': '*'
            }
          }
        }
      }
    ])

    // console.log(result)
    return {result}
  }catch(e: any) {
    throw createError({
      message: e.message,
  });
  }

})

