import { useState } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import Overview from './components/Overview'
import Financial from './components/Financial'
import Product from './components/Product'
import Settings from './components/Settings'
import SaveIndicator from './components/SaveIndicator'
import Login from './components/Login'
import { StateProvider } from './context/StateContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import './App.css'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#f1f5f9'
      }}>
        <div>Загрузка...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <StateProvider>
      <div className="container">
        <Header />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'financial' && <Financial />}
        {activeTab === 'product' && <Product />}
        {activeTab === 'settings' && <Settings />}
        
        <SaveIndicator />
      </div>
    </StateProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  )
}

export default App