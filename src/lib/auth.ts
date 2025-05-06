import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }
}

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'hello@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        if (!user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture // Google provides high quality profile picture
        }
      } 
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: `https://graph.facebook.com/${profile.id}/picture?type=large` // Facebook high res profile picture
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string | null | undefined,
          name: token.name as string | null | undefined,
          image: typeof token.picture === 'string' ? token.picture : (typeof token.image === 'string' ? token.image : null),
        },
      };
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        const u = user as any;
        token.id = u.id;
        token.email = u.email;
        token.name = u.name;
        // Use high quality images from social providers
        if (account?.provider === 'google') {
          token.picture = profile?.picture;
        } else if (account?.provider === 'facebook') {
          token.picture = `https://graph.facebook.com/${profile?.id}/picture?type=large`;
        } else {
          token.picture = u.image || null;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  // Prevent auto-login
  events: {
    async signIn({ user, account, profile }) {
      // Only update for social logins
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        const imageUrl = account.provider === 'google' 
          ? profile?.picture
          : `https://graph.facebook.com/${profile?.id}/picture?type=large`;
          
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: profile?.name || user.name,
            email: profile?.email || user.email,
            image: imageUrl || user.image,
          },
        });
      }
    },
    async signOut({ session, token }) {
      // You can add custom logic here when a user signs out
    },
  },
}