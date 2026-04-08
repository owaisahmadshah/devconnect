const isProduction = process.env.NODE_ENV === "PRODUCTION"

const cookieBase = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
}

export const accessTokenCookieOptions = {
  ...cookieBase,
  maxAge: 50 * 60 * 1000, // 50 minutes
}

export const refreshTokenCookieOptions = {
  ...cookieBase,
  maxAge: 25 * 24 * 60 * 60 * 1000, // 25 days
}
