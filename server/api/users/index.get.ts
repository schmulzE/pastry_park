import { Users } from "~~/server/models/user";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineEventHandler(async (event) => {
    const usersWithPassword = await Users.find();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const usersWithoutPassword = usersWithPassword.map(({ password, ...user }) => user);

    return usersWithoutPassword;
});
