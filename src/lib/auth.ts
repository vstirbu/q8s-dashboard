import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const prisma = new PrismaClient();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // TODO: https://github.com/nextauthjs/next-auth/discussions/4124#discussioncomment-7028388
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      "use server";
      //   console.log("signIn", user, account, profile);

      return true;
    },
  },
  events: {
    createUser: async (message) => {
      "use server";
      console.log("createUser", message.user);
    },
  },
});
