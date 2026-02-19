import { getRoadmap, setRoadmap } from '../../kv.js'

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
      const { id } = req.query
      
      const items = await getRoadmap()
      const itemIndex = items.findIndex(item => item.id === parseInt(id))
      
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Roadmap item not found' })
      }
      
      items[itemIndex].completed = items[itemIndex].completed === 1 ? 0 : 1
      items[itemIndex].updated_at = new Date().toISOString()
      
      await setRoadmap(items)
      
      res.status(200).json({
        success: true,
        completed: items[itemIndex].completed === 1
      })
    } catch (error) {
      console.error('Error toggling roadmap item:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}
