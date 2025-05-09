import { Account, NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcrypt'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import type { FacebookProfile } from 'next-auth/providers/facebook'
import type { GoogleProfile } from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    username?: string | null;
    roles?: string[] | null;
    role?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      username?: string | null;
      roles?: string[] | null;
      role?: string | null;
    }
  }
}

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
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
          throw new Error('Please enter your email and password')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          throw new Error('No user found with this email')
        }

        if (!user.password) {
          throw new Error('Please sign in with your social account')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
          roles: (user as any).roles || ['user'],
          role: user.role,
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
          image: profile.picture,
          username: profile.email?.split('@')[0] || profile.sub,
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'email,public_profile'
        }
      },
      profile(profile: FacebookProfile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture?.data?.url || `https://graph.facebook.com/${profile.id}/picture?type=large`,
          username: profile.email?.split('@')[0] || profile.id,
            birthday: profile.birthday // This may be undefined, handle accordingly elsewhere
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log('session callback', { session, token });

      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        session.user.username = token.username as string

        session.user.roles = token.roles as string[]
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user, account, profile }: { token: JWT, user: User, account: Account | null, profile?: any }) {
      console.log('jwt callback', { token, user, account, profile });
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.username = user.username

        token.roles = user.roles

        token.role = user.role
      }
      return token
    },
    async signIn({ user, account, profile }) {
      console.log('signIn callback', { user, account, profile });
      // Update lastLogin for all providers
      if (user?.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: { lastLogin: new Date() },
        });
      }

      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: {
              accounts: true  
            }
          })

          if (existingUser) {
            // Check if user already has an account with this provider
            const existingAccount = existingUser.accounts.find(
              acc => acc.provider === account.provider
            )

            if (!existingAccount) {
              // Link the new OAuth account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  expires_at: account.expires_at,
                }
              })
            }

            // Update user profile data
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name,
                image:
                  user.image ||
                  (account?.provider === 'google' && (profile as import('next-auth/providers/google').GoogleProfile).picture) ||
                  (account?.provider === 'facebook' && (profile as import('next-auth/providers/facebook').FacebookProfile).picture?.data?.url) ||
                  existingUser.image,
                emailVerified: new Date(),
              }
            })
          } else {
            // Create new user with social profile
            const username = user.email?.split('@')[0] || user.id
            let uniqueUsername = username
            let counter = 1

            // Ensure username uniqueness
            while (await prisma.user.findFirst({ where: { username: uniqueUsername } })) {
              uniqueUsername = `${username}${counter}`
              counter++
            }

            await prisma.user.create({
              data: {
                id: user.id,
                email: user.email!,
                name: user.name,
                image: user.image,
                username: uniqueUsername,
                roles: ['user'],
                role: 'user',
                emailVerified: new Date(),
                profileInitialized: true,
                favoriteTeam: 'FC Escuela',
                language: 'English',
                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    expires_at: account.expires_at,
                  }
                }
              } as any
            })
          }
          return true
        } catch (error) {
          console.error('Error during social sign in:', error)
          return false
        }
      }
      // Age check for Facebook
      if (account?.provider === 'facebook') {
        const birthday = (profile as { birthday?: string })?.birthday; // Format: MM/DD/YYYY
        if (birthday) {
          const [month, day, year] = birthday.split('/').map(Number);
          const birthDate = new Date(year, month - 1, day);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 18) {
            return false; // Deny login if under 18
          }
        } else {
          return false; // Deny login if birthday missing
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}