import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/lib/db";
import {
  createRoleBindingForServiceAccount,
  createRoleBindingForUser,
  createSecret,
  createServiceAccount,
} from "@/lib/k8s";

const adapter = PrismaAdapter(prisma);

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  // TODO: https://github.com/nextauthjs/next-auth/discussions/4124#discussioncomment-7028388
  adapter,
  providers: [
    GitHubProvider,
    // Auth0Provider({
    //   clientId: process.env.AUTH0_CLIENT_ID as string,
    //   clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
  ],
  callbacks: {
    // session: async ({ session, token, user }) => {
    //   "use server";
    //   console.log("session", session, token, user);

    //   return session;
    // },
    // jwt: async ({token, user, account, profile, trigger}) => {
    //   "use server";
    //   console.log("jwt", token, user, account, profile, trigger);

    //   return token;
    // },
    signIn: async ({ user, account, profile }) => {
      "use server";
      // console.log("signIn", user, account, profile);

      const _user = await adapter.getUserByEmail!(user.email!);

      if (_user === null) {
        // should redirect to signup page
      }

      return true;
    },
  },
  events: {
    createUser: async ({ user }) => {
      "use server";
      console.log("createUser", user);

      const created = await createRoleBindingForUser(user.email!);

      // console.log("createRoleBindingForUser", created);

      try {
        await createServiceAccount(user.id!);
        console.log("Service account created");
      } catch (e) {
        console.error(e);
        console.log("Failed to create service account");
      }

      try {
        await createRoleBindingForServiceAccount(user.id!);
        console.log("Role binding created");
      } catch (error) {
        console.error(error);
        console.log("Failed to create role binding for service account");
      }

      try {
        await createSecret(user.id!);
        console.log("Secret created");
      } catch (error) {
        console.error(error);
        console.log("Failed to create secret");
      }

      console.log("User configured", user);
    },
  },
});
