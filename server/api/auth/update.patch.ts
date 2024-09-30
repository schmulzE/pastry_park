import { getServerSession } from '#auth';
import { User } from "~/server/models/user";
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name } = body; // Get the updated fields from the request body
  
    const session = await getServerSession(event as any);
  
    if (!session || !session.user || !session.user.email) {
			return sendError(event, createError({ statusCode: 401, message: 'Unauthorized' }));
    }
  
    // Find the user by email (or another unique identifier)
    const user = await User.findOne({ email: session.user.email });
  
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      });
    }
  
    // Update the user's data
    user.name = name || user.name;
  
    await user.save();
  
    return { success: true, user };
    
  } catch (error: any) {
    throw createError({
			message: error.message,
		});
  }
});
