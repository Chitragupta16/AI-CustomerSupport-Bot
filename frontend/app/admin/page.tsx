export const dynamic = "force-dynamic";

import { requireAuth } from "../../lib/require-auth"
import AdminClient from "./admin-client"

export default async function AdminPage() {
  const session = await requireAuth({ redirectTo: "/login?callbackUrl=/admin" })
  return <AdminClient token={session?.accessToken as string | undefined} />
}
