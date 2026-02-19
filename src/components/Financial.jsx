import { useAppState } from '../context/StateContext'
import './Financial.css'

const Financial = () => {
  const { state, saveData } = useAppState()

  const handleFinancialChange = (field, value) => {
    saveData({ [field]: parseInt(value) || 0 })
  }

  const capexTotal = state.capexEquipment + state.capexInstall
  const profitPerMonth = state.mrr - state.opex
  const margin = Math.round((profitPerMonth / state.mrr) * 100)

  // Quarterly calculations
  const quarters = [
    { courts: 25, new: 14 },
    { courts: 45, new: 20 },
    { courts: 70, new: 25 },
    { courts: 100, new: 30 }
  ]

  const calculateQuarterly = () => {
    return quarters.map((q, idx) => {
      const revenue = q.courts * state.mrr * 3
      const opex = q.courts * state.opex * 3
      const capex = q.new * capexTotal
      const cashflow = revenue - opex - capex
      return {
        num: idx + 1,
        courts: q.courts,
        revenue: revenue / 1000,
        opex: opex / 1000,
        capex: capex / 1000,
        cashflow: cashflow / 1000
      }
    })
  }

  const quarterlyData = calculateQuarterly()
  let accum = 0
  const accumulated = quarterlyData.map(q => {
    accum += q.cashflow
    return accum
  })

  const totals = {
    revenue: quarterlyData.reduce((sum, q) => sum + q.revenue * 3, 0),
    opex: quarterlyData.reduce((sum, q) => sum + q.opex * 3, 0),
    capex: quarterlyData.reduce((sum, q) => sum + q.capex, 0),
    cashflow: quarterlyData.reduce((sum, q) => sum + q.cashflow * 3, 0)
  }

  return (
    <div className="financial-section">
      <div className="grid">
        {/* CAPEX Breakdown */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">CAPEX (Инвестиции)</div>
            <div className="card-badge">Единоразовые</div>
          </div>
          
          <div className="input-group">
            <div className="input-label">
              <span>Стоимость оборудования на корт</span>
              <span className="input-value">₽{state.capexEquipment.toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={state.capexEquipment}
              onChange={(e) => handleFinancialChange('capexEquipment', e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <div className="input-label">
              <span>Монтаж и установка</span>
              <span className="input-value">₽{state.capexInstall.toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={state.capexInstall}
              onChange={(e) => handleFinancialChange('capexInstall', e.target.value)}
            />
          </div>
          
          <div className="metric-grid" style={{ marginTop: '30px' }}>
            <div className="metric-box">
              <div className="metric-label">CAPEX на корт</div>
              <div className="metric-value">₽{capexTotal.toLocaleString()}</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Общий CAPEX ({state.targetCourts} кортов)</div>
              <div className="metric-value negative">₽{(capexTotal * state.targetCourts).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* OPEX & Revenue */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">OPEX & Выручка</div>
            <div className="card-badge">Ежемесячные</div>
          </div>
          
          <div className="input-group">
            <div className="input-label">
              <span>Абонентская плата с клуба (MRR)</span>
              <span className="input-value">₽{state.mrr.toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={state.mrr}
              onChange={(e) => handleFinancialChange('mrr', e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <div className="input-label">
              <span>OPEX на корт (обслуживание)</span>
              <span className="input-value">₽{state.opex.toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={state.opex}
              onChange={(e) => handleFinancialChange('opex', e.target.value)}
            />
          </div>
          
          <div className="metric-grid" style={{ marginTop: '30px' }}>
            <div className="metric-box">
              <div className="metric-label">Маржинальность</div>
              <div className="metric-value positive">{margin}%</div>
            </div>
            <div className="metric-box">
              <div className="metric-label">Прибыль на корт/мес</div>
              <div className="metric-value positive">₽{profitPerMonth.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quarterly Financial Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Финансовый план по кварталам</div>
          <div className="card-badge">2026</div>
        </div>
        
        <table className="financial-table">
          <thead>
            <tr>
              <th>Показатель</th>
              <th>Q1</th>
              <th>Q2</th>
              <th>Q3</th>
              <th>Q4</th>
              <th>Итого</th>
            </tr>
          </thead>
          <tbody>
            <tr className="quarter-header">
              <td colSpan="6">Количество кортов (накопительно)</td>
            </tr>
            <tr>
              <td>Активные корты</td>
              {quarterlyData.map(q => <td key={q.num}>{q.courts}</td>)}
              <td>-</td>
            </tr>
            <tr className="quarter-header">
              <td colSpan="6">Финансовые потоки (тыс. ₽)</td>
            </tr>
            <tr>
              <td>Выручка (MRR × кол-во)</td>
              {quarterlyData.map(q => <td key={q.num}>{q.revenue.toFixed(0)}</td>)}
              <td>{totals.revenue.toFixed(0)}</td>
            </tr>
            <tr>
              <td>OPEX</td>
              {quarterlyData.map(q => <td key={q.num}>{q.opex.toFixed(0)}</td>)}
              <td>{totals.opex.toFixed(0)}</td>
            </tr>
            <tr>
              <td>CAPEX (новые корты)</td>
              {quarterlyData.map(q => <td key={q.num}>{q.capex.toFixed(0)}</td>)}
              <td>{totals.capex.toFixed(0)}</td>
            </tr>
            <tr className="total-row">
              <td>Чистый денежный поток</td>
              {quarterlyData.map(q => <td key={q.num}>{q.cashflow.toFixed(0)}</td>)}
              <td>{totals.cashflow.toFixed(0)}</td>
            </tr>
            <tr style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <td>Накопительная прибыль</td>
              {accumulated.map((acc, idx) => (
                <td key={idx} style={idx === 3 ? { color: '#4ade80', fontWeight: 700 } : {}}>
                  {acc.toFixed(0)}
                </td>
              ))}
              <td>-</td>
            </tr>
          </tbody>
        </table>
        
        <div className="alert" style={{ marginTop: '20px', background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <div className="alert-title" style={{ color: '#fbbf24' }}>Точка безубыточности</div>
            <div className="alert-text">
              При текущих параметрах компания выходит в операционную прибыль в Q2 2027. Для ускорения необходимо увеличить MRR или сократить CAPEX на 15%.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Financial