import { setState } from './kv.js'

export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'POST') {
    try {
      const defaultState = {
        currentCourts: 11,
        targetCourts: 100,
        occupancyRate: 75,
        conversionRate: 15,
        capexEquipment: 80000,
        capexInstall: 20000,
        mrr: 12000,
        opex: 3000,
        features: {}
      }

      await setState(defaultState)

      res.status(200).json({
        success: true,
        message: 'Data reset to default values'
      })
    } catch (error) {
      console.error('Error resetting data:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}
