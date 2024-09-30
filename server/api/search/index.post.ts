import { getServerSession } from '#auth';
import { Recipe } from "~~/server/models/recipe";

export default defineEventHandler(async(event) => {
  const body = await readBody(event);
  const { query } = body;
  const session = await getServerSession(event as any);

  if (!session || !session.user) {
    return sendError(event, createError({ statusCode: 401, message: 'Unauthorized' }));
  }
  
  const userId = session!.user.id
  try{
    const result = await Recipe.aggregate([
      {
        '$search': {
          'index': 'searchRecipe',
          'text': {
            'query': query,
            'path': {
              'wildcard': '*'
            },
            'fuzzy': {}
          }
        }
      },
      // {
      //   '$match': {
      //     'created_by': userId
      //   }
      // }
    ])

    return {result}
  }catch(e: any) {
    throw createError({
      message: e.message,
  });
  }

})

