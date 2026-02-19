import { useState, useEffect } from 'react'
import { useAppState } from '../context/StateContext'
import { HiPencil, HiTrash, HiCheck } from 'react-icons/hi2'
import RoadmapModal from './RoadmapModal'
import RoadmapChart from './RoadmapChart'
import './Product.css'

const quarterInfo = {
  'Q1': { name: 'Q1 2026', period: 'Февраль — Март', focus: 'Фокус: Стабилизация и шаблонизация' },
  'Q2': { name: 'Q2 2026', period: 'Апрель — Июнь', focus: 'Фокус: Монетизация и удержание' },
  'Q3': { name: 'Q3 2026', period: 'Июль — Сентябрь', focus: 'Фокус: Масштаб и новые сегменты' },
  'Q4': { name: 'Q4 2026', period: 'Октябрь — Декабрь', focus: 'Фокус: Enterprise и оптимизация' }
}

const Product = () => {
  const { roadmapData, updateRoadmap, loadRoadmap } = useAppState()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [addingQuarter, setAddingQuarter] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'chart'

  // Перезагружаем данные при монтировании компонента
  useEffect(() => {
    if (roadmapData.length === 0) {
      loadRoadmap()
    }
  }, [])

  const handleToggle = async (id) => {
    await updateRoadmap('toggle', { id })
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      await updateRoadmap('delete', { id })
    }
  }

  const handleAdd = (quarter) => {
    setAddingQuarter(quarter)
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingItem(null)
    setAddingQuarter(null)
  }

  const renderQuarter = (quarter) => {
    const items = roadmapData.filter(item => item.quarter === quarter)
    const info = quarterInfo[quarter]

    return (
      <div key={quarter} className="quarter-block">
        <div className="quarter-header-actions">
          <div>
            <div className="quarter-title">
              <span>{info.name}</span>
              <span className="quarter-period">{info.period}</span>
            </div>
            <div className="quarter-focus">{info.focus}</div>
          </div>
        </div>
        <ul className="feature-list">
          {items.length > 0 ? (
            items.map(item => (
              <li
                key={item.id}
                className={`feature-item ${item.completed === 1 || item.completed === true ? 'completed' : ''}`}
              >
                <div
                  className="feature-checkbox"
                  onClick={() => handleToggle(item.id)}
                >
                  {item.completed === 1 || item.completed === true ? <HiCheck /> : null}
                </div>
                <div className="feature-text">{item.title}</div>
                {item.tag && <span className="feature-tag">{item.tag}</span>}
                <div className="feature-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(item)}
                    title="Редактировать"
                  >
                    <HiPencil />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.id)}
                    title="Удалить"
                  >
                    <HiTrash />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li style={{ color: '#64748b', padding: '20px', textAlign: 'center' }}>
              Нет элементов
            </li>
          )}
        </ul>
        <button className="btn-add" onClick={() => handleAdd(quarter)}>
          + Добавить элемент
        </button>
      </div>
    )
  }

  return (
    <div className="product-section">
      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          📋 Список
        </button>
        <button
          className={`toggle-btn ${viewMode === 'chart' ? 'active' : ''}`}
          onClick={() => setViewMode('chart')}
        >
          📊 График
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="feature-roadmap">
          {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => renderQuarter(quarter))}
        </div>
      ) : (
        <RoadmapChart />
      )}

      {modalOpen && (
        <RoadmapModal
          item={editingItem}
          quarter={addingQuarter || editingItem?.quarter}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

export default Product