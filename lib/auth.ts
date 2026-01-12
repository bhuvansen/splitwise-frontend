import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.accessToken = account.id_token
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        (session as any).accessToken = token.accessToken
      }
      return session;
    },
  },
};

export async function getCurrentEmailId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    throw new Error("Not authenticated");
  }

  return session.user.email;
}

