import { useState } from 'react'
import { useAppState } from '../context/StateContext'
import { HiCheckCircle } from 'react-icons/hi2'
import { FaCircle } from 'react-icons/fa'
import RoadmapModal from './RoadmapModal'
import './RoadmapChart.css'

const quarterInfo = {
  'Q1': { name: 'Q1 2026', start: 0, end: 3 },
  'Q2': { name: 'Q2 2026', start: 3, end: 6 },
  'Q3': { name: 'Q3 2026', start: 6, end: 9 },
  'Q4': { name: 'Q4 2026', start: 9, end: 12 }
}

const monthLabels = ['Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

const RoadmapChart = () => {
  const { roadmapData, updateRoadmap } = useAppState()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [addingQuarter, setAddingQuarter] = useState(null)

  const handleItemClick = (item) => {
    setEditingItem(item)
    setAddingQuarter(null)
    setModalOpen(true)
  }

  const handleAdd = (quarter) => {
    setAddingQuarter(quarter)
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleToggle = async (e, id) => {
    e.stopPropagation()
    await updateRoadmap('toggle', { id })
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingItem(null)
    setAddingQuarter(null)
  }

  // Вычисляем позицию элемента внутри квартала
  const getItemPosition = (item, quarterItems) => {
    const quarter = quarterInfo[item.quarter]
    if (!quarter) return { x: 0, width: 0 }
    
    const itemIndex = quarterItems.findIndex(i => i.id === item.id)
    const itemsInQuarter = quarterItems.length
    
    // Вычисляем позицию внутри квартала (0-3 месяца)
    const quarterWidth = 25 // 25% на квартал (3 месяца из 12)
    const spacing = 2 // Увеличиваем отступ между блоками
    
    // Начало квартала в процентах
    const quarterStart = (quarter.start / 12) * 100
    
    // Увеличиваем ширину блоков для лучшего отображения текста
    const minItemWidth = 18 // Минимальная ширина блока в процентах
    const calculatedWidth = Math.max((quarterWidth / itemsInQuarter) - spacing, minItemWidth)
    
    // Позиция элемента внутри квартала
    const x = quarterStart + (quarterWidth / itemsInQuarter) * itemIndex
    const width = calculatedWidth
    
    return { x, width }
  }

  const getQuarterColor = (quarter) => {
    const colors = {
      'Q1': '#3b82f6',
      'Q2': '#8b5cf6',
      'Q3': '#ec4899',
      'Q4': '#f59e0b'
    }
    return colors[quarter] || '#64748b'
  }

  const getTagColor = (tag) => {
    const colors = {
      'Критично': '#ef4444',
      'Core': '#3b82f6',
      'B2B': '#8b5cf6',
      'Операции': '#10b981',
      'Revenue': '#f59e0b',
      'AI': '#ec4899',
      'Retention': '#06b6d4',
      'Expansion': '#84cc16',
      'B2C': '#f97316',
      'Engagement': '#a855f7',
      'Platform': '#14b8a6',
      'Enterprise': '#6366f1',
      'Scale': '#d946ef',
      'Milestone': '#22c55e'
    }
    return colors[tag] || '#64748b'
  }

  // Группируем элементы по кварталам для отображения
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  
  // Вычисляем позиции для всех элементов
  const getQuarterItems = (quarter) => {
    return roadmapData
      .filter(item => item.quarter === quarter)
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  }

  // Вычисляем максимальную высоту для каждого квартала (с запасом под многострочный текст)
  const getQuarterHeight = (quarter) => {
    const items = getQuarterItems(quarter)
    if (items.length === 0) return 80
    // Увеличиваем высоту для каждого элемента, чтобы текст помещался
    return items.length * 120 + 60
  }

  // Вычисляем общую высоту контента
  const totalHeight = quarters.reduce((sum, q) => sum + getQuarterHeight(q), 0) + 40

  let currentY = 20

  return (
    <>
    <div className="roadmap-chart-container">
      {/* Add buttons for each quarter - перемещены над графиком */}
      <div className="chart-add-buttons-top">
        {quarters.map(quarter => (
          <button
            key={quarter}
            className="chart-add-btn"
            onClick={() => handleAdd(quarter)}
            style={{ borderColor: getQuarterColor(quarter) }}
          >
            + Добавить в {quarterInfo[quarter].name}
          </button>
        ))}
      </div>

      <div className="roadmap-chart-header">
        <div className="chart-timeline-header">
          {monthLabels.map((month, idx) => (
            <div
              key={idx}
              className="timeline-month"
              style={{ left: `${(idx / 12) * 100}%` }}
            >
              {month}
            </div>
          ))}
        </div>
        {/* Quarter dividers */}
        {quarters.map((q) => (
          <div
            key={q}
            className="quarter-divider"
            style={{
              left: `${(quarterInfo[q].start / 12) * 100}%`,
              borderColor: getQuarterColor(q)
            }}
          />
        ))}
      </div>

      <div className="roadmap-chart-content" style={{ minHeight: `${totalHeight}px` }}>
        {quarters.map((quarter) => {
          const items = getQuarterItems(quarter)
          const quarterY = currentY
          currentY += getQuarterHeight(quarter)
          
          if (items.length === 0) {
            return (
              <div key={quarter} className="quarter-group">
                <div className="quarter-label" style={{ borderColor: getQuarterColor(quarter), top: `${quarterY}px` }}>
                  {quarterInfo[quarter].name}
                </div>
                <div className="quarter-items" style={{ top: `${quarterY}px` }}>
                  <div className="empty-quarter">Нет элементов</div>
                </div>
              </div>
            )
          }

          return (
            <div key={quarter} className="quarter-group">
              <div className="quarter-label" style={{ borderColor: getQuarterColor(quarter), top: `${quarterY}px` }}>
                {quarterInfo[quarter].name}
              </div>
              <div className="quarter-items" style={{ top: `${quarterY}px` }}>
                {items.map((item, idx) => {
                  const pos = getItemPosition(item, items)
                  const isCompleted = item.completed === 1 || item.completed === true
                  
                  return (
                    <div
                      key={item.id}
                      className={`chart-item ${isCompleted ? 'completed' : ''}`}
                      style={{
                        left: `${pos.x}%`,
                        width: `${pos.width}%`,
                        top: `${idx * 120}px`,
                        backgroundColor: getTagColor(item.tag),
                        opacity: isCompleted ? 0.6 : 1
                      }}
                      title={item.title}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="chart-item-content">
                        <div className="chart-item-title">{item.title}</div>
                        {item.tag && (
                          <div className="chart-item-tag">{item.tag}</div>
                        )}
                        <div className="chart-item-actions">
                          <button
                            className="chart-item-toggle"
                            onClick={(e) => handleToggle(e, item.id)}
                            title={isCompleted ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
                          >
                            {isCompleted ? <HiCheckCircle /> : <FaCircle />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-title">Легенда:</div>
        <div className="legend-items">
          {quarters.map(q => (
            <div key={q} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: getQuarterColor(q) }}
              />
              <span>{quarterInfo[q].name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {modalOpen && (
      <RoadmapModal
        item={editingItem}
        quarter={addingQuarter || editingItem?.quarter}
        onClose={handleModalClose}
      />
    )}
    </>
  )
}

export default RoadmapChart