import { useState, useEffect } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import Overview from './components/Overview'
import Financial from './components/Financial'
import Product from './components/Product'
import Settings from './components/Settings'
import SaveIndicator from './components/SaveIndicator'
import { StateProvider } from './context/StateContext'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('overview')

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

export default App