import { useState } from 'react'
import AuthPage      from './pages/AuthPage'
import LinkPage      from './pages/LinkPage'
import LoadingPage   from './pages/LoadingPage'
import DashboardPage from './pages/DashboardPage'
import { analyzeUrl } from './utils/mlEngine'

// Must be >= sum of all LoadingPage step durations (700+600+800+500+400 = 3000ms)
const ANALYSIS_DELAY_MS = 3200

export default function App() {
  const [screen, setScreen] = useState('auth')   // auth | link | loading | dashboard
  const [user,   setUser]   = useState(null)
  const [url,    setUrl]    = useState('')
  const [result, setResult] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setScreen('link')
  }

  const handleAnalyze = (productUrl) => {
    setUrl(productUrl)
    setScreen('loading')
    setTimeout(() => {
      setResult(analyzeUrl(productUrl))
      setScreen('dashboard')
    }, ANALYSIS_DELAY_MS)
  }

  const handleNewAnalysis = () => {
    setUrl('')
    setScreen('link')
  }

  const handleLogout = () => {
    setUser(null)
    setResult(null)
    setUrl('')
    setScreen('auth')
  }

  return (
    <>
      {screen === 'auth'      && <AuthPage onLogin={handleLogin} />}
      {screen === 'link'      && <LinkPage user={user} onAnalyze={handleAnalyze} onLogout={handleLogout} />}
      {screen === 'loading'   && <LoadingPage url={url} />}
      {screen === 'dashboard' && result && (
        <DashboardPage
          result={result}
          user={user}
          onNewAnalysis={handleNewAnalysis}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}
