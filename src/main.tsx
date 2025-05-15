import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { TournamentProvider } from './context/TournamentContext'
import AppRouter from './routes'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TournamentProvider>
        <AppRouter />
      </TournamentProvider>
    </HashRouter>
  </StrictMode>,
)
