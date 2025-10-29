import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './moduls/App/App.jsx'
import AppRouter from './router/AppRouter.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
