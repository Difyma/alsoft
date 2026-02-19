import { getKV } from '../kv.js'
import crypto from 'crypto'

const SECRET_KEY = process.env.AUTH_SECRET || 'your-secret-key-change-in-production'

function verifyToken(token) {
  try {
    const [payload, signature] = token.split('.')
    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex')
    
    if (signature !== expectedSignature) {
      return null
    }
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    
    if (decoded.exp < Date.now()) {
      return null
    }
    
    return decoded
  } catch (e) {
    return null
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = verifyToken(token)
      
      if (decoded) {
        const kv = await getKV()
        if (kv) {
          await kv.del(`auth_token_${decoded.userId}`)
        }
      }
    }

    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error during logout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
