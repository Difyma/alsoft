import './Tabs.css'

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: '📊 Обзор', icon: '📊' },
    { id: 'financial', label: '💰 Финансы', icon: '💰' },
    { id: 'product', label: '🚀 Продукт', icon: '🚀' },
    { id: 'settings', label: '⚙️ Настройки', icon: '⚙️' }
  ]

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default Tabs