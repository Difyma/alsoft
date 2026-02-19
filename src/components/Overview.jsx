import { useAppState } from '../context/StateContext'
import RevenueChart from './RevenueChart'
import './Overview.css'

const Overview = () => {
  const { state, saveData } = useAppState()

  const handleCourtsChange = (value) => {
    saveData({ currentCourts: parseInt(value) })
  }

  const progress = Math.round((state.currentCourts / state.targetCourts) * 100)
  const remaining = state.targetCourts - state.currentCourts
  const monthsLeft = 10
  const tempo = (remaining / monthsLeft).toFixed(1)
  
  const capexTotal = state.capexEquipment + state.capexInstall
  const profitPerMonth = state.mrr - state.opex
  const payback = profitPerMonth > 0 ? (capexTotal / profitPerMonth).toFixed(1) : '∞'
  
  const cac = capexTotal * 0.45
  const ltv = profitPerMonth * 12 * 3
  const ratio = (ltv / cac).toFixed(1)
  const margin = Math.round((profitPerMonth / state.mrr) * 100)

  return (
    <div className="overview-section">
      <div className="grid">
        {/* Current Status */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Текущий прогресс</div>
            <div className="card-badge">Live</div>
          </div>
          
          <div className="input-group">
            <div className="input-label">
              <span>Установлено кортов</span>
              <span className="input-value">{state.currentCourts}</span>
            </div>
            <input
              type="range"
              id="courtsRange"
              min="0"
              max="100"
              value={state.currentCourts}
              onChange={(e) => handleCourtsChange(e.target.value)}
            />
          </div>
          
          <div className="progress-container">
            <div className="progress-header">
              <span>Путь к {state.targetCourts} кортам</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          
          <div className="metric-grid">
            <div className="metric-box">
              <div className="metric-label">Осталось установить</div>
              <div className="metric-value">{remaining}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Темп (в месяц)</div>
              <div className="metric-value">{tempo}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Загрузка слотов</div>
              <div className="metric-value">{state.occupancyRate}%</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Payback период</div>
              <div className="metric-value">{payback} мес</div>
            </div>
          </div>
        </div>

        {/* Unit Economics */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Unit-экономика</div>
            <div className="card-badge">на 1 корт</div>
          </div>
          
          <div className="metric-grid">
            <div className="metric-box">
              <div className="metric-label">CAC (привлечение)</div>
              <div className="metric-value">₽{Math.round(cac).toLocaleString()}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">LTV (3 года)</div>
              <div className="metric-value positive">₽{Math.round(ltv).toLocaleString()}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">LTV/CAC Ratio</div>
              <div className="metric-value positive">{ratio}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">MRR на корт</div>
              <div className="metric-value">₽{state.mrr.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="alert">
            <div className="alert-icon">💡</div>
            <div className="alert-content">
              <div className="alert-title">Рекомендация</div>
              <div className="alert-text">
                {payback > 6 
                  ? `При текущих показателях окупаемость ${payback} месяцев выше нормы (6 мес). Рекомендуется увеличить MRR на ${Math.ceil((payback/6 - 1) * 100)}% или снизить CAPEX.`
                  : ratio < 3
                  ? `LTV/CAC ratio ${ratio} ниже целевого (3.0). Фокус на удержание клиентов и снижение стоимости привлечения.`
                  : `Unit-экономика здоровая: окупаемость ${payback} мес, LTV/CAC ${ratio}. Можно масштабировать агрессивнее.`
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Прогноз выручки и расходов</div>
          <div className="card-badge">2026</div>
        </div>
        <RevenueChart />
      </div>
    </div>
  )
}

export default Overview