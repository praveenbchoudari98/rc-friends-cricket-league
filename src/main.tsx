import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { TournamentProvider } from './context/TournamentContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TournamentProvider>
        <App />
      </TournamentProvider>
    </HashRouter>
  </StrictMode>,
)
