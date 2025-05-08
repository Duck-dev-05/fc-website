import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient, User as PrismaUser } from '@prisma/client'
import { compare } from 'bcrypt'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import type { FacebookProfile } from 'next-auth/providers/facebook'
import type { GoogleProfile } from 'next-auth/providers/google'

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
      profile(profile: GoogleProfile) {
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
      profile(profile: FacebookProfile) {
        // Always use real data from Facebook
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url || `https://graph.facebook.com/${profile.id}/picture?type=large`
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Always use real data from token (which is set from provider)
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
        // Always use real images from social providers
        if (account?.provider === 'google' && profile) {
          token.picture = (profile as GoogleProfile).picture;
        } else if (account?.provider === 'facebook' && profile) {
          token.picture = (profile as FacebookProfile).picture?.data?.url || `https://graph.facebook.com/${(profile as FacebookProfile).id}/picture?type=large`;
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
      if ((account?.provider === 'google' || account?.provider === 'facebook') && profile) {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } }) as (PrismaUser & { profileInitialized: boolean }) | null;
        const isFirstLogin = !(dbUser && dbUser.profileInitialized);
        let generatedUsername = dbUser?.username;
        if (isFirstLogin && !generatedUsername) {
          // Generate username from email before @
          const baseUsername = (user.email || '').split('@')[0] || 'user';
          let username = baseUsername;
          // Ensure uniqueness
          while (await prisma.user.findFirst({ where: { username } })) {
            username = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
          }
          generatedUsername = username;
        }
        if (account?.provider === 'google') {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              name: (profile as GoogleProfile).name || user.name,
              email: (profile as GoogleProfile).email || user.email,
              image: (profile as GoogleProfile).picture || user.image,
              ...(isFirstLogin && {
                role: 'user',
                favoriteTeam: 'FC Escuela',
                language: 'English',
                profileInitialized: true,
                username: generatedUsername,
              }),
            },
          });
        } else if (account?.provider === 'facebook') {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              name: (profile as FacebookProfile).name || user.name,
              email: (profile as FacebookProfile).email || user.email,
              image: (profile as FacebookProfile).picture?.data?.url || `https://graph.facebook.com/${(profile as FacebookProfile).id}/picture?type=large` || user.image,
              ...(isFirstLogin && {
                role: 'user',
                favoriteTeam: 'FC Escuela',
                language: 'English',
                profileInitialized: true,
                username: generatedUsername,
              }),
            },
          });
        }
      }
    },
    async signOut({ session, token }) {
      // You can add custom logic here when a user signs out
    },
  },
}