import { Users } from "~~/server/models/user";
import { sendError, H3Event } from "h3";
// import bcrypt from "bcryptjs";

// Hashes a password and returns a promise that resolves to the hashed password
// async function hashPassword(password: string) {
//     const saltRounds = 10; // Number of salt rounds, you can adjust this value
//     return await bcrypt.hash(password, saltRounds);
// }

export default defineEventHandler(async (event: H3Event) => {
    try {
        const body = await readBody(event);

        // deconstruct user details
        const { username, email, password } = body;
        const confirmEmail = await Users.findOne({ email: email });
        
        if (confirmEmail) return sendError(event, createError({ statusCode: 400, data: "this email already exist" }));
        const hashedPassword = await hash(password);
        await Users.create({ username, email, password: hashedPassword });
        return { data: { message: "User registered successfully" } };
    } catch (error: any) {
        return sendError(event, createError({ statusCode: 500, data: error.data }));
    }
});
