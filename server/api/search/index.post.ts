import { getServerSession } from '#auth';
import mongoose from 'mongoose';
import { Recipe } from "~~/server/models/recipe";

export default defineEventHandler(async(event) => {
  const body = await readBody(event);
  const { query } = body;
  const session = await getServerSession(event as any);

  if (!session) {
    return sendError(event, createError({ statusCode: 401, message: 'Unauthorized' }));
  }

  const userId = session?.user.id;

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
      {
        '$match': {
          'created_by': new mongoose.Types.ObjectId(userId)
        }
      }
    ])
    return {result}
  }catch(e: any) {
    throw createError({
      message: e.message,
  });
  }

})

