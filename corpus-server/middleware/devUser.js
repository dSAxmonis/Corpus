import mongoose from 'mongoose'

/**
 * TEMPORARY STUB.
 * Real auth (JWT) isn't built yet. To keep every Item correctly scoped to a
 * userId from day one, we attach a fixed demo user id to every request.
 *
 * When auth is built, delete this file and replace its usage with the real
 * authMiddleware that reads req.user from a verified JWT.
 */
const DEV_USER_ID = new mongoose.Types.ObjectId('000000000000000000000001')

export function devUser(req, res, next) {
  req.user = { id: DEV_USER_ID }
  next()
}
