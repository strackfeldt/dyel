import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.id = token.id;
      return session;
    },
  },
  theme: {
    colorScheme: "light",
  },
  secret: process.env.SECRET,
});
