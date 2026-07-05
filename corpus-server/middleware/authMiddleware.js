import jwt from 'jsonwebtoken'

/**
 * Protects routes by verifying the JWT access token in the
 * Authorization: Bearer <token> header.
 *
 * On success: attaches req.user = { id } and calls next().
 * On failure: returns 401 so the client can attempt a refresh.
 */
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided.' })
  }

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
    req.user = { id: decoded.id }
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' })
    }
    return res.status(401).json({ error: 'Invalid token.' })
  }
}
