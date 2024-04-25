// import NextAuth from "next-auth";
// import Auth0Provider from "next-auth/providers/auth0";

// const handler = NextAuth({
//   providers: [
//     Auth0Provider({
//       clientId: process.env.AUTH0_CLIENT_ID,
//       clientSecret: process.env.AUTH0_CLIENT_SECRET,
//       issuer: process.env.AUTH0_ISSUER,
//     }),
//   ],
// });

// export { handler as GET, handler as POST };

export { GET, POST } from "@/lib/auth";
