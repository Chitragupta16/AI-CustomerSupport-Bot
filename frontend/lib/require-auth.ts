import { auth } from "../server/auth"
import { redirect } from "next/navigation"

export async function requireAuth({ redirectTo = "/login" }: { redirectTo?: string } = {}) {
  const session = await auth()
  if (!session) {
    redirect(redirectTo)
  }
  return session
}
