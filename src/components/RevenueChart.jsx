import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useAppState } from '../context/StateContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const RevenueChart = () => {
  const { state } = useAppState()

  const months = ['Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  const courtsByMonth = [11, 18, 25, 32, 39, 45, 55, 62, 70, 85, 92, 100]
  
  const revenueData = courtsByMonth.map(c => c * state.mrr)
  const opexData = courtsByMonth.map(c => c * state.opex)

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Выручка (MRR)',
        data: revenueData,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'OPEX',
        data: opexData,
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e2e8f0' }
      }
    },
    scales: {
      y: {
        ticks: { 
          color: '#94a3b8',
          callback: function(value) {
            return '₽' + value/1000 + 'k'
          }
        },
        grid: { color: '#334155' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: '#334155' }
      }
    }
  }

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  )
}

export default RevenueChart