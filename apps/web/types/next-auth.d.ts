import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            backendJWTToken: string;
        };
    }

    interface User {
        id: string;
        username: string;
        token: string
    }

    interface JWT {
        id: string;
        username: string;
        backendJWTToken: string
    }
}
