import { getKV, getUsers, setUsers } from '../kv.js'
import crypto from 'crypto'

const SECRET_KEY = process.env.AUTH_SECRET || 'your-secret-key-change-in-production'
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 дней

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + SECRET_KEY).digest('hex')
}

function generateToken(userId) {
  const payload = {
    userId,
    exp: Date.now() + TOKEN_EXPIRY
  }
  const token = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(token).digest('hex')
  return `${token}.${signature}`
}

// Функции getUsers и setUsers импортируются из kv.js

async function initDefaultUser() {
  const users = await getUsers()
  // Всегда обновляем пароль админа при запуске (для синхронизации)
  const adminPassword = '5X)8.1{GEs%i8jh'
  const updatedUsers = {
    ...users,
    admin: {
      id: 'admin',
      username: 'admin',
      passwordHash: hashPassword(adminPassword),
      createdAt: users?.admin?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
  await setUsers(updatedUsers)
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

  await initDefaultUser()

  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    const users = await getUsers()
    const user = users[username]

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const passwordHash = hashPassword(password)
    if (user.passwordHash !== passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user.id)

    const kv = await getKV()
    if (kv) {
      await kv.set(`auth_token_${user.id}`, token, { ex: Math.floor(TOKEN_EXPIRY / 1000) })
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
