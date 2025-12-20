import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // Use process.env for Convex environment variables
      // Set CLERK_JWT_ISSUER_DOMAIN in .env.local for local dev
      // and in Convex Dashboard for production
      // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ]
} satisfies AuthConfig;