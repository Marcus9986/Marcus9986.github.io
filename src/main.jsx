import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Home, ProjectPage } from './pages.jsx'
import './styles.css'

// Plates start dimmed only when JS can light them; without JS everything renders lit.
document.documentElement.classList.add('js')

const root = document.getElementById('root')
const page = root.dataset.page

createRoot(root).render(
  <StrictMode>{page === 'home' ? <Home /> : <ProjectPage slug={page} />}</StrictMode>,
)
