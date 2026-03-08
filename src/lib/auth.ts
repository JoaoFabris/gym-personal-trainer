import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI } from "better-auth/plugins";

import { prisma } from "./db.js";
import { env } from "./env.js";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [
    env.WEB_APP_BASE_URL,
    env.API_BASE_URL,
    "http://127.0.0.1:8081",
  ],
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [openAPI()],
  advanced: {
    crossSubDomainCookies: {
      enabled: true, // aqui ele permite q o coockie possa setado como domain correto, compartilhado entre difirente subdominios, dentro do dominio
    }
  }
});