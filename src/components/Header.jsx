import { useAppState } from '../context/StateContext'
import { useAuth } from '../context/AuthContext'
import { HiSparkles } from 'react-icons/hi2'
import { IoLogOutOutline } from 'react-icons/io5'
import './Header.css'

const Header = () => {
  const { state } = useAppState()
  const { user, logout } = useAuth()
  
  const progress = Math.round((state.currentCourts / state.targetCourts) * 100)
  const annualRevenue = state.mrr * state.targetCourts * 12

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="header">
      <div className="header-title">
        <h1><HiSparkles className="header-icon" /> Алсофт Dashboard</h1>
        <div className="header-subtitle">Стратегическое управление продуктом • 2026</div>
      </div>
      <div className="header-right">
        <div className="header-stats">
          <div className="header-stat">
            <div className="header-stat-value">{state.currentCourts}</div>
            <div className="header-stat-label">Кортов сейчас</div>
          </div>
          <div className="header-stat">
            <div className="header-stat-value">{progress}%</div>
            <div className="header-stat-label">К цели</div>
          </div>
          <div className="header-stat">
            <div className="header-stat-value">₽{(annualRevenue / 1000000).toFixed(1)}M</div>
            <div className="header-stat-label">Годовая выручка</div>
          </div>
        </div>
        <div className="header-user">
          <span className="header-username">{user?.username}</span>
          <button className="header-logout" onClick={handleLogout} title="Выйти">
            <IoLogOutOutline />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header