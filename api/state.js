import { getState, setState } from './kv.js'

export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    try {
      const state = await getState()
      res.status(200).json(state)
    } catch (error) {
      console.error('Error fetching state:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const {
        currentCourts,
        targetCourts,
        occupancyRate,
        conversionRate,
        capexEquipment,
        capexInstall,
        mrr,
        opex,
        features
      } = req.body

      const state = {
        currentCourts,
        targetCourts,
        occupancyRate,
        conversionRate,
        capexEquipment,
        capexInstall,
        mrr,
        opex,
        features: features || {}
      }

      await setState(state)

      res.status(200).json({
        success: true,
        message: 'State saved successfully'
      })
    } catch (error) {
      console.error('Error saving state:', error)
      res.status(500).json({ error: 'Internal server error', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}
