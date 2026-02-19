// Простой Express сервер для локальной разработки
// Эмулирует Vercel serverless функции

import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check (до API маршрутов)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Импортируем и регистрируем API handlers
async function registerApiRoutes() {
  try {
    // State API
    const stateModule = await import('./api/state.js')
    const stateHandler = stateModule.default
    app.get('/api/state', stateHandler)
    app.post('/api/state', stateHandler)
    app.options('/api/state', (req, res) => {
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.status(200).end()
    })

    // Roadmap API
    const roadmapModule = await import('./api/roadmap.js')
    const roadmapHandler = roadmapModule.default
    app.get('/api/roadmap', roadmapHandler)
    app.post('/api/roadmap', roadmapHandler)
    app.put('/api/roadmap', roadmapHandler)
    app.delete('/api/roadmap', roadmapHandler)
    app.options('/api/roadmap', (req, res) => {
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.status(200).end()
    })
    
    // Roadmap by ID
    const roadmapIdHandler = (await import('./api/roadmap/[id].js')).default
    app.all('/api/roadmap/:id', (req, res) => {
      req.query = req.query || {}
      req.query.id = req.params.id
      roadmapIdHandler(req, res)
    })

    // Roadmap toggle
    const roadmapToggleHandler = (await import('./api/roadmap/[id]/toggle.js')).default
    app.all('/api/roadmap/:id/toggle', (req, res) => {
      req.query = req.query || {}
      req.query.id = req.params.id
      roadmapToggleHandler(req, res)
    })

    // Auth API
    const authLoginModule = await import('./api/auth/login.js')
    const authLoginHandler = authLoginModule.default
    app.post('/api/auth/login', async (req, res) => {
      await authLoginHandler(req, res)
    })
    app.options('/api/auth/login', (req, res) => {
      res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.status(200).end()
    })

    const authLogoutModule = await import('./api/auth/logout.js')
    const authLogoutHandler = authLogoutModule.default
    app.post('/api/auth/logout', authLogoutHandler)
    app.options('/api/auth/logout', (req, res) => {
      res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
      res.status(200).end()
    })

    const authVerifyModule = await import('./api/auth/verify.js')
    const authVerifyHandler = authVerifyModule.default
    app.get('/api/auth/verify', authVerifyHandler)
    app.options('/api/auth/verify', (req, res) => {
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
      res.status(200).end()
    })

    // Export API
    const exportHandler = (await import('./api/export.js')).default
    app.all('/api/export', exportHandler)

    // Reset API
    const resetHandler = (await import('./api/reset.js')).default
    app.all('/api/reset', resetHandler)

    console.log('✅ API routes registered')
  } catch (error) {
    console.error('❌ Error registering API routes:', error)
  }
}

// Register API routes и запуск сервера
async function startServer() {
  try {
    await registerApiRoutes()

    // Статические файлы (для production build) - ПОСЛЕ API маршрутов
    app.use(express.static(join(__dirname, 'dist')))

    // Fallback для SPA (только для не-API запросов)
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(join(__dirname, 'dist', 'index.html'))
    })

    app.listen(PORT, () => {
      console.log(`\n🚀 Development server запущен на http://localhost:${PORT}`)
      console.log(`📊 Frontend доступен на http://localhost:5174 (Vite dev server)`)
      console.log(`🔌 API доступен на http://localhost:${PORT}/api\n`)
    })
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error)
    process.exit(1)
  }
}

startServer()
