// Утилита для работы с Vercel KV или fallback на in-memory хранилище
let memoryStore = {
  dashboard_state: null,
  roadmap_items: []
}

// Инициализация данных по умолчанию для roadmap
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

// Инициализация данных по умолчанию для state
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

// Инициализация памяти при первом запуске
if (!memoryStore.dashboard_state) {
  memoryStore.dashboard_state = defaultState
  memoryStore.roadmap_items = defaultRoadmapData
}

export async function getKV() {
  // Пытаемся использовать Vercel KV если доступен
  try {
    const { kv } = await import('@vercel/kv')
    return kv
  } catch (e) {
    // Fallback на in-memory хранилище
    return null
  }
}

export async function getState() {
  const kv = await getKV()
  if (kv) {
    const state = await kv.get('dashboard_state')
    return state || defaultState
  }
  return memoryStore.dashboard_state || defaultState
}

export async function setState(state) {
  const kv = await getKV()
  if (kv) {
    await kv.set('dashboard_state', state)
  } else {
    memoryStore.dashboard_state = state
  }
}

export async function getRoadmap() {
  const kv = await getKV()
  if (kv) {
    const items = await kv.get('roadmap_items')
    return items || defaultRoadmapData
  }
  return memoryStore.roadmap_items.length > 0 ? memoryStore.roadmap_items : defaultRoadmapData
}

export async function setRoadmap(items) {
  const kv = await getKV()
  if (kv) {
    await kv.set('roadmap_items', items)
  } else {
    memoryStore.roadmap_items = items
  }
}
