import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user?: {
      id?: string
      email?: string | null
      name?: string | null
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        if (!email || !password) return null

        // Example: accept any non-empty; attach a placeholder access token
        return { id: email, email, name: email.split("@")[0], accessToken: "demo-token" } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).accessToken) {
        token.accessToken = (user as any).accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token && (token as any).accessToken) {
        session.accessToken = (token as any).accessToken as string
      }
      return session
    },
  },
  // Ensure NEXTAUTH_SECRET and NEXTAUTH_URL are set in deployment
})
