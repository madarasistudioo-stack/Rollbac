import { withAuth } from "next-auth/middleware";

const ADMINS = (process.env.ADMIN_EMAILS ?? "madarasistudioo@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

// First gate for /admin: only signed-in admin emails get through.
// Each admin page re-checks on the server as well.
export default withAuth({
  callbacks: {
    authorized: ({ token }) => Boolean(token?.email && ADMINS.includes(String(token.email).toLowerCase())),
  },
  pages: { signIn: "/auth/signin" },
});

export const config = { matcher: ["/admin/:path*"] };
