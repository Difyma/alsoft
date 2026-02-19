import { getUsers, getKV } from '../kv.js'
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

// Функция getUsers импортируется из kv.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} not allowed` })
  }

  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Проверяем токен в KV (если доступен) или пропускаем проверку для in-memory режима
    try {
      const kv = await getKV()
      if (kv) {
        const storedToken = await kv.get(`auth_token_${decoded.userId}`)
        if (storedToken !== token) {
          return res.status(401).json({ error: 'Token not found' })
        }
      }
      // В in-memory режиме пропускаем проверку токена в KV
    } catch (kvError) {
      console.error('Error checking token in KV:', kvError)
      // Продолжаем без проверки KV для in-memory режима
    }

    const users = await getUsers()
    const user = users[decoded.userId]

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username
      }
    })
  } catch (error) {
    console.error('Error verifying token:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
