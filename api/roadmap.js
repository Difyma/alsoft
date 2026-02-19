import { getRoadmap, setRoadmap } from './kv.js'

export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { id, quarter } = req.query

  if (req.method === 'GET') {
    try {
      const items = await getRoadmap()
      
      // Если указан quarter, фильтруем
      if (quarter) {
        const filtered = items.filter(item => item.quarter === quarter)
        return res.status(200).json(filtered)
      }
      
      // Сортируем по quarter и order_index
      const sorted = items.sort((a, b) => {
        if (a.quarter !== b.quarter) {
          return a.quarter.localeCompare(b.quarter)
        }
        return (a.order_index || 0) - (b.order_index || 0)
      })
      
      res.status(200).json(sorted)
    } catch (error) {
      console.error('Error fetching roadmap:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      // Проверяем, это создание нового элемента или toggle
      if (id && req.url.includes('/toggle')) {
        // Toggle completed status
        const items = await getRoadmap()
        const itemIndex = items.findIndex(item => item.id === parseInt(id))
        
        if (itemIndex === -1) {
          return res.status(404).json({ error: 'Roadmap item not found' })
        }
        
        items[itemIndex].completed = items[itemIndex].completed === 1 ? 0 : 1
        items[itemIndex].updated_at = new Date().toISOString()
        
        await setRoadmap(items)
        
        return res.status(200).json({
          success: true,
          completed: items[itemIndex].completed === 1
        })
      }
      
      // Создание нового элемента
      const { quarter, title, description, tag, order_index } = req.body
      
      if (!quarter || !title) {
        return res.status(400).json({ error: 'Quarter and title are required' })
      }
      
      const items = await getRoadmap()
      const newId = Math.max(...items.map(i => i.id || 0), 0) + 1
      
      const newItem = {
        id: newId,
        quarter,
        title,
        description: description || '',
        tag: tag || '',
        completed: 0,
        order_index: order_index || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      items.push(newItem)
      await setRoadmap(items)
      
      res.status(200).json({
        success: true,
        id: newId,
        message: 'Roadmap item created successfully'
      })
    } catch (error) {
      console.error('Error creating roadmap item:', error)
      res.status(500).json({ error: 'Internal server error', details: error.message })
    }
  } else if (req.method === 'PUT') {
    try {
      if (!id) {
        return res.status(400).json({ error: 'ID is required' })
      }
      
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
      if (!id) {
        return res.status(400).json({ error: 'ID is required' })
      }
      
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
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}
