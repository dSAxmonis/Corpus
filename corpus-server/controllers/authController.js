import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import User from '../models/User.js'

function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.ACCESS_SECRET, { expiresIn: '15m' })
}
function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' })
}

// ── THE CRITICAL FIX ──
// In production, frontend (vercel.app) and backend (onrender.com) are
// different domains, so this is a cross-site request. Cookies only survive
// cross-site requests if sameSite is 'none' AND secure is true. Locally,
// both are on localhost so 'lax' + not-secure works fine.
function setRefreshCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production'
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,                    // must be true when sameSite is 'none'
    sameSite: isProd ? 'none' : 'lax',  // 'none' required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

const signupSchema = z.object({
  name: z.string().min(1).max(80).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6),
})

export async function signup(req, res) {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten().fieldErrors })
  const { name, email, password } = parsed.data
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash, credits: 100, plan: 'free' })
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: refreshToken } })
    setRefreshCookie(res, refreshToken)
    return res.status(201).json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, credits: user.credits, plan: user.plan },
    })
  } catch (err) {
    console.error('[signup]', err.message)
    return res.status(500).json({ error: 'Signup failed.' })
  }
}

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
})

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid email or password.' })
  const { email, password } = parsed.data
  try {
    const user = await User.findOne({ email })
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid email or password.' })
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password.' })
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: refreshToken } })
    setRefreshCookie(res, refreshToken)
    return res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, credits: user.credits, plan: user.plan },
    })
  } catch (err) {
    console.error('[login]', err.message)
    return res.status(500).json({ error: 'Login failed.' })
  }
}

export async function refresh(req, res) {
  const token = req.cookies?.refreshToken
  if (!token) return res.status(401).json({ error: 'No refresh token.' })
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET)
    const user = await User.findOne({ _id: decoded.id, refreshTokens: token })
    if (!user) return res.status(401).json({ error: 'Invalid refresh token.' })
    const newAccessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)
    await User.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: token },
      $push: { refreshTokens: newRefreshToken },
    })
    setRefreshCookie(res, newRefreshToken)
    return res.json({ accessToken: newAccessToken })
  } catch {
    return res.status(401).json({ error: 'Refresh token expired or invalid.' })
  }
}

export async function logout(req, res) {
  const token = req.cookies?.refreshToken
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET)
      await User.findByIdAndUpdate(decoded.id, { $pull: { refreshTokens: token } })
    } catch {}
  }
  const isProd = process.env.NODE_ENV === 'production'
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  })
  return res.json({ success: true })
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -refreshTokens')
    if (!user) return res.status(404).json({ error: 'User not found.' })
    return res.json({ user })
  } catch {
    return res.status(500).json({ error: 'Failed to fetch user.' })
  }
}
