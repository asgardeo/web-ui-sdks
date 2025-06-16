import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

const key = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload
}

export async function login(formData: FormData) {
  // Verify credentials & get the user
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // In a real app, you'd verify against your database
  // For demo purposes, we'll use a simple check
  if (email === "demo@teamspace.com" && password === "password") {
    const user = { id: "1", email: "demo@teamspace.com", name: "Demo User" }

    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const session = await encrypt({ user, expires })

    // Save the session in a cookie
    cookies().set("session", session, { expires, httpOnly: true })

    return { success: true, user }
  }

  return { success: false, error: "Invalid credentials" }
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // In a real app, you'd save to your database
  // For demo purposes, we'll create a session immediately
  const user = { id: Date.now().toString(), email, name }

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ user, expires })

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true })

  return { success: true, user }
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) })
}

export async function getSession() {
  const session = cookies().get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value
  if (!session) return

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  })
  return res
}
