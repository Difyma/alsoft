import { getRoadmap, setRoadmap } from '../kv.js'

export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const items = await getRoadmap()
      const item = items.find(i => i.id === parseInt(id))
      
      if (!item) {
        return res.status(404).json({ error: 'Roadmap item not found' })
      }
      
      res.status(200).json(item)
    } catch (error) {
      console.error('Error fetching roadmap item:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const items = await getRoadmap()
      const itemIndex = items.findIndex(item => item.id === parseInt(id))
      
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Roadmap item not found' })
      }
      
      const { quarter, title, description, tag, completed, order_index } = req.body
      
      if (quarter !== undefined) items[itemIndex].quarter = quarter
      if (title !== undefined) items[itemIndex].title = title
      if (description !== undefined) items[itemIndex].description = description
      if (tag !== undefined) items[itemIndex].tag = tag
      if (completed !== undefined) items[itemIndex].completed = completed
      if (order_index !== undefined) items[itemIndex].order_index = order_index
      items[itemIndex].updated_at = new Date().toISOString()
      
      await setRoadmap(items)
      
      res.status(200).json({
        success: true,
        message: 'Roadmap item updated successfully'
      })
    } catch (error) {
      console.error('Error updating roadmap item:', error)
      res.status(500).json({ error: 'Internal server error', details: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      const items = await getRoadmap()
      const itemIndex = items.findIndex(item => item.id === parseInt(id))
      
      if (itemIndex === -1) {
        return res.status(404).json({ error: 'Roadmap item not found' })
      }
      
      items.splice(itemIndex, 1)
      await setRoadmap(items)
      
      res.status(200).json({
        success: true,
        message: 'Roadmap item deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting roadmap item:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}
