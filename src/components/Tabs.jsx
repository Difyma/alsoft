import { HiChartBar, HiCurrencyDollar, HiRocketLaunch, HiCog } from 'react-icons/hi2'
import './Tabs.css'

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Обзор', icon: HiChartBar },
    { id: 'financial', label: 'Финансы', icon: HiCurrencyDollar },
    { id: 'product', label: 'Продукт', icon: HiRocketLaunch },
    { id: 'settings', label: 'Настройки', icon: HiCog }
  ]

  return (
    <div className="tabs">
      {tabs.map(tab => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon className="tab-icon" />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default Tabs