import axios from "axios"
import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signin`, {
                    username: credentials?.username,
                    password: credentials?.password
                })
                const responseData = res.data;

                return {
                    id: responseData.user.id,
                    username: responseData.user.username,
                    token: responseData.token,
                }
            }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log(user);
                token.id = user.id;
                token.username = user.username;
                token.backendJWTToken = user.token
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.backendJWTToken = token.backendJWTToken as string
            }
            return session;
        }
    },
    pages: {
        signIn: "/signin"
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };