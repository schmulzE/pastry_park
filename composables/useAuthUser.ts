import type { UserWithoutPassword } from "~~/types";
// import type { User } from "~~/types";

export const useAuthUser = () => {
    return useState<UserWithoutPassword | null>("user", () => null);
    // return useState<User | null>("user", () => null);
};
