import { useAppState } from '../context/StateContext'
import './Settings.css'

const Settings = () => {
  const { state, saveData } = useAppState()

  const handleReset = async () => {
    if (window.confirm('Вы уверены? Все данные будут сброшены к значениям по умолчанию.')) {
      try {
        const response = await fetch('/api/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          window.location.reload()
        }
      } catch (error) {
        console.error('Error resetting data:', error)
      }
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export')
      if (response.ok) {
        const data = await response.json()
        const dataStr = JSON.stringify(data, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'alsoft-dashboard-data.json'
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  return (
    <div className="settings-section">
      <div className="grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Параметры модели</div>
            <div className="card-badge">Редактируемые</div>
          </div>
          
          <div className="input-group">
            <div className="input-label">
              <span>Целевое количество кортов</span>
              <span className="input-value">{state.targetCourts}</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={state.targetCourts}
              onChange={(e) => saveData({ targetCourts: parseInt(e.target.value) })}
            />
          </div>
          
          <div className="input-group">
            <div className="input-label">
              <span>Средняя загрузка слотов (%)</span>
              <span className="input-value">{state.occupancyRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={state.occupancyRate}
              onChange={(e) => saveData({ occupancyRate: parseInt(e.target.value) })}
            />
          </div>
          
          <div className="input-group">
            <div className="input-label">
              <span>Конверсия в платящего (тренеры)</span>
              <span className="input-value">{state.conversionRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={state.conversionRate}
              onChange={(e) => saveData({ conversionRate: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Управление данными</div>
            <div className="card-badge">Система</div>
          </div>
          
          <button
            onClick={handleReset}
            className="btn-reset"
          >
            Сбросить все данные
          </button>
          
          <button
            onClick={handleExport}
            className="btn-export"
          >
            Экспортировать JSON
          </button>
          
          <div className="data-info">
            Данные автоматически сохраняются в локальном хранилище браузера. При очистке куки данные сбросятся.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings