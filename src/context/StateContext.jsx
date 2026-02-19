import { createContext, useContext, useState, useEffect } from 'react'

const StateContext = createContext()

export const useAppState = () => {
  const context = useContext(StateContext)
  if (!context) {
    throw new Error('useAppState must be used within StateProvider')
  }
  return context
}

const API_BASE_URL = '/api'

export const StateProvider = ({ children }) => {
  const [state, setState] = useState({
    currentCourts: 11,
    targetCourts: 100,
    occupancyRate: 75,
    conversionRate: 15,
    capexEquipment: 80000,
    capexInstall: 20000,
    mrr: 12000,
    opex: 3000,
    features: {}
  })

  // Default roadmap data (fallback)
  const defaultRoadmapData = [
    { id: 1, quarter: 'Q1', title: 'Оптимизация CJM — сокращение time-to-first-video до 2 минут', description: '', tag: 'Критично', completed: 0, order_index: 0 },
    { id: 2, quarter: 'Q1', title: 'Автоматическая обработка видео (без ручного вмешательства)', description: '', tag: 'Core', completed: 0, order_index: 1 },
    { id: 3, quarter: 'Q1', title: 'Дашборд для клубов — статистика загрузки слотов', description: '', tag: 'B2B', completed: 0, order_index: 2 },
    { id: 4, quarter: 'Q1', title: 'Масштабирование до 25 кортов (шаблон установки)', description: '', tag: 'Операции', completed: 0, order_index: 3 },
    { id: 5, quarter: 'Q2', title: 'Тренерский модуль — разбор техники, замедление, рисование', description: '', tag: 'Revenue', completed: 0, order_index: 0 },
    { id: 6, quarter: 'Q2', title: 'Модуль турниров — автоматические трансляции и таблицы', description: '', tag: 'Revenue', completed: 0, order_index: 1 },
    { id: 7, quarter: 'Q2', title: 'AI-генерация хайлайтов (лучшие моменты автоматом)', description: '', tag: 'AI', completed: 0, order_index: 2 },
    { id: 8, quarter: 'Q2', title: 'Интеграция с календарями клубов (заполнение пустых слотов)', description: '', tag: 'Retention', completed: 0, order_index: 3 },
    { id: 9, quarter: 'Q3', title: 'Поддержка классических теннисных кортов', description: '', tag: 'Expansion', completed: 0, order_index: 0 },
    { id: 10, quarter: 'Q3', title: 'Мобильное приложение v2.0 — социальные функции', description: '', tag: 'B2C', completed: 0, order_index: 1 },
    { id: 11, quarter: 'Q3', title: 'Система рейтингов и достижений игроков', description: '', tag: 'Engagement', completed: 0, order_index: 2 },
    { id: 12, quarter: 'Q3', title: 'API для интеграции с внешними сервисами', description: '', tag: 'Platform', completed: 0, order_index: 3 },
    { id: 13, quarter: 'Q4', title: 'White-label решение для сетевых клубов', description: '', tag: 'Enterprise', completed: 0, order_index: 0 },
    { id: 14, quarter: 'Q4', title: 'Аналитика предсказания (предиктивная загрузка)', description: '', tag: 'AI', completed: 0, order_index: 1 },
    { id: 15, quarter: 'Q4', title: 'Мульти-корт управление (единый центр для 10+ кортов)', description: '', tag: 'Scale', completed: 0, order_index: 2 },
    { id: 16, quarter: 'Q4', title: 'Достижение цели: 100 активных кортов', description: '', tag: 'Milestone', completed: 0, order_index: 3 }
  ]

  // Инициализируем с данными по умолчанию или из localStorage
  const getInitialRoadmapData = () => {
    try {
      const saved = localStorage.getItem('roadmapData')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.error('Error loading initial roadmap from localStorage:', e)
    }
    return defaultRoadmapData
  }

  const [roadmapData, setRoadmapData] = useState(getInitialRoadmapData())
  const [saveIndicator, setSaveIndicator] = useState(false)

  // Load state from API
  useEffect(() => {
    loadData()
    loadRoadmap()
  }, [])

  const loadData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/state`)
      if (response.ok) {
        const data = await response.json()
        setState(data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const loadRoadmap = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/roadmap`)
      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          setRoadmapData(data)
          // Сохраняем в localStorage как backup
          localStorage.setItem('roadmapData', JSON.stringify(data))
          return
        }
      }
    } catch (error) {
      console.error('Error loading roadmap from API:', error)
    }
    
    // Fallback: пробуем загрузить из localStorage
    try {
      const saved = localStorage.getItem('roadmapData')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.length > 0) {
          setRoadmapData(parsed)
          return
        }
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e)
    }
    
    // Если ничего не загрузилось, используем данные по умолчанию
    console.log('Using default roadmap data')
    setRoadmapData(defaultRoadmapData)
    localStorage.setItem('roadmapData', JSON.stringify(defaultRoadmapData))
  }

  const saveData = async (newState) => {
    try {
      const updatedState = { ...state, ...newState }
      const response = await fetch(`${API_BASE_URL}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedState)
      })
      
      if (response.ok) {
        setState(updatedState)
        showSaveIndicator()
      }
    } catch (error) {
      console.error('Error saving data:', error)
    }
  }

  const showSaveIndicator = () => {
    setSaveIndicator(true)
    setTimeout(() => setSaveIndicator(false), 2000)
  }

  const updateRoadmap = async (action, data) => {
    try {
      let response
      let updatedData = [...roadmapData]
      
      switch (action) {
        case 'create':
          response = await fetch(`${API_BASE_URL}/roadmap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          if (response.ok) {
            const result = await response.json()
            const newItem = { ...data, id: result.id || Date.now() }
            updatedData.push(newItem)
          }
          break
        case 'update':
          response = await fetch(`${API_BASE_URL}/roadmap/${data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          if (response.ok) {
            const index = updatedData.findIndex(i => i.id === data.id)
            if (index !== -1) {
              updatedData[index] = { ...updatedData[index], ...data }
            }
          }
          break
        case 'delete':
          response = await fetch(`${API_BASE_URL}/roadmap/${data.id}`, {
            method: 'DELETE'
          })
          if (response.ok) {
            updatedData = updatedData.filter(i => i.id !== data.id)
          }
          break
        case 'toggle':
          response = await fetch(`${API_BASE_URL}/roadmap/${data.id}/toggle`, {
            method: 'POST'
          })
          if (response.ok) {
            const result = await response.json()
            const index = updatedData.findIndex(i => i.id === data.id)
            if (index !== -1) {
              updatedData[index].completed = result.completed ? 1 : 0
            }
          }
          break
        default:
          return false
      }

      // Обновляем локальное состояние и localStorage даже если API не работает
      if (!response || !response.ok) {
        // Fallback: обновляем локально
        switch (action) {
          case 'create':
            updatedData.push({ ...data, id: Date.now(), completed: 0, order_index: 0 })
            break
          case 'update':
            const updateIndex = updatedData.findIndex(i => i.id === data.id)
            if (updateIndex !== -1) {
              updatedData[updateIndex] = { ...updatedData[updateIndex], ...data }
            }
            break
          case 'delete':
            updatedData = updatedData.filter(i => i.id !== data.id)
            break
          case 'toggle':
            const toggleIndex = updatedData.findIndex(i => i.id === data.id)
            if (toggleIndex !== -1) {
              updatedData[toggleIndex].completed = updatedData[toggleIndex].completed === 1 ? 0 : 1
            }
            break
        }
      }
      
      setRoadmapData(updatedData)
      localStorage.setItem('roadmapData', JSON.stringify(updatedData))
      showSaveIndicator()
      return true
    } catch (error) {
      console.error('Error updating roadmap:', error)
      // Fallback на локальное обновление
      let updatedData = [...roadmapData]
      switch (action) {
        case 'create':
          updatedData.push({ ...data, id: Date.now(), completed: 0, order_index: 0 })
          break
        case 'update':
          const index = updatedData.findIndex(i => i.id === data.id)
          if (index !== -1) {
            updatedData[index] = { ...updatedData[index], ...data }
          }
          break
        case 'delete':
          updatedData = updatedData.filter(i => i.id !== data.id)
          break
        case 'toggle':
          const toggleIndex = updatedData.findIndex(i => i.id === data.id)
          if (toggleIndex !== -1) {
            updatedData[toggleIndex].completed = updatedData[toggleIndex].completed === 1 ? 0 : 1
          }
          break
      }
      setRoadmapData(updatedData)
      localStorage.setItem('roadmapData', JSON.stringify(updatedData))
      showSaveIndicator()
      return true
    }
  }

  return (
    <StateContext.Provider value={{
      state,
      roadmapData,
      saveIndicator,
      setState,
      saveData,
      updateRoadmap,
      loadRoadmap,
      showSaveIndicator
    }}>
      {children}
    </StateContext.Provider>
  )
}