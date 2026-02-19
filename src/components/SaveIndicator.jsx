import { useAppState } from '../context/StateContext'
import './SaveIndicator.css'

const SaveIndicator = () => {
  const { saveIndicator } = useAppState()

  return (
    <div className={`save-indicator ${saveIndicator ? 'show' : ''}`}>
      💾 Сохранено
    </div>
  )
}

export default SaveIndicator