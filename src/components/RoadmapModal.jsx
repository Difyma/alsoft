import { useState, useEffect } from 'react'
import { useAppState } from '../context/StateContext'
import './RoadmapModal.css'

const RoadmapModal = ({ item, quarter, onClose }) => {
  const { updateRoadmap } = useAppState()
  const [formData, setFormData] = useState({
    quarter: quarter || 'Q1',
    title: '',
    description: '',
    tag: ''
  })

  useEffect(() => {
    if (item) {
      setFormData({
        quarter: item.quarter,
        title: item.title,
        description: item.description || '',
        tag: item.tag || ''
      })
    }
  }, [item])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (item) {
      await updateRoadmap('update', { ...formData, id: item.id })
    } else {
      await updateRoadmap('create', formData)
    }
    
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal show" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {item ? 'Редактировать элемент' : 'Добавить элемент'}
          </h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="modal-label">Квартал</label>
            <select
              className="modal-select"
              value={formData.quarter}
              onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
              required
            >
              <option value="Q1">Q1 2026 (Февраль — Март)</option>
              <option value="Q2">Q2 2026 (Апрель — Июнь)</option>
              <option value="Q3">Q3 2026 (Июль — Сентябрь)</option>
              <option value="Q4">Q4 2026 (Октябрь — Декабрь)</option>
            </select>
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Название</label>
            <input
              type="text"
              className="modal-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название фичи"
              required
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Описание (необязательно)</label>
            <textarea
              className="modal-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Дополнительное описание"
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">Тег</label>
            <select
              className="modal-select"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            >
              <option value="">Без тега</option>
              <option value="Критично">Критично</option>
              <option value="Core">Core</option>
              <option value="B2B">B2B</option>
              <option value="Операции">Операции</option>
              <option value="Revenue">Revenue</option>
              <option value="AI">AI</option>
              <option value="Retention">Retention</option>
              <option value="Expansion">Expansion</option>
              <option value="B2C">B2C</option>
              <option value="Engagement">Engagement</option>
              <option value="Platform">Platform</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Scale">Scale</option>
              <option value="Milestone">Milestone</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-modal btn-modal-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-modal btn-modal-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RoadmapModal