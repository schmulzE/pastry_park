import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";
import { NuxtAuthHandler } from "#auth";
import { User } from "~/server/models/user";
import { AdapterUser } from "next-auth/adapters";
import { Session, AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,

  pages: {
    signIn: "/login",
  },

  providers: [
    // @ts-expect-error
    CredentialsProvider.default({
      name: "credentials",
      credentials: {},
      async authorize(credentials: { name: string; password: string }) {
        const user = await User.findOne({ name: credentials.name });

        if (!user) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
          });
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
          });
        }

        return {
          ...user.toObject(),
          password: undefined,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }

      return token;
    },
    async session({ session, token, user }: { session: Session; token: JWT; user: AdapterUser }) {
      if (session?.user?.email) {
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          session.user.name = sessionUser.name;
        }
      }
      return session as Session | DefaultSession;
    },
  },
});