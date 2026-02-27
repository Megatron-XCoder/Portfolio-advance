import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.JWT_SECRET || "default-development-secret-key-change-in-production"
const encodedKey = new TextEncoder().encode(secretKey)

export async function signToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function verifyToken(token: string | undefined = "") {
  try {
    if (!token) return null
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("Failed to verify token")
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session")?.value
  if (!sessionToken) return null
  return await verifyToken(sessionToken)
}
