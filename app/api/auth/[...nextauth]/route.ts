// import { NextApiRequest, NextApiResponse } from "next";
// import NextAuth, { NextAuthOptions } from "next-auth";
// import CredentialProvider from "next-auth/providers/credentials";

// const options: NextAuthOptions = {
//   providers: [
//     CredentialProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: 'email', type: 'text' },
// 				password: { label: 'password', type: 'password' }
//       },

//       async authorize(credentials) {
//         console.log('CREDENTIALS', credentials);

//         const response = await fetch(
//           "https://privatus-homol.automatizai.com.br/token",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               email: "lucas0409lf@gmail.com",
//               password: "1Manualzai#brincante",
//               client_id: "autenticador",
//               grant_type: "password",
//             }),
//           }
//         );

//         const user = await response.json();

//         if (user && response.ok) {
//           return user;
//         }

//         return null;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   // Add any other options here
// };

// const handler = NextAuth(options);

// export { handler as GET, handler as POST };

import NextAuth from 'next-auth/next'
import { NextAuthOptions } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = {
          id: '1',
          email: 'user@email.com',
          password: '12345678',
          name: 'User Hardcoded',
          role: 'admin'
        }

        // const isValidEmail = user.email === credentials?.email
        // const isValidPassword = user.password === credentials?.password

        // if (!isValidEmail || !isValidPassword) {
        //   return null
        // }

        return user
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const customUser = user as unknown as any

      if (user) {
        return {
          ...token,
          role: customUser.role
        }
      }

      return token
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          name: token.name,
          email: token.email,
          role: token.role
        }
      }
    }
  },
  pages: {
    signIn: '/auth/login'
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }