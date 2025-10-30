import { prisma } from "../config/db.js"

// Generic visit logger. Accepts either a transaction client (tx) or the global prisma instance.
export async function logVisit(prismaOrTx, {
  visitId,
  action,
  details = null,
  userId = null,
  branchId = null,
  hn = null
} = {}) {
  const client = prismaOrTx || prisma
  if (!client || !visitId || !action) return
  try {
    await client.visitLog.create({
      data: {
        visitId,
        action,
        details: details ? toJson(details) : null,
        userId,
        branchId,
        hn
      }
    })
  } catch (err) {
    // console.error('visitLogger error:', err)
  }
}

function toJson(v) {
  if (v == null) return null
  try {
    // Ensure it's JSON-serializable (prisma Json accepts object)
    return typeof v === 'string' ? { message: v } : v
  } catch {
    return { message: String(v) }
  }
}


