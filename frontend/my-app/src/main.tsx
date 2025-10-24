import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainMenu from './screens/MainMenu/MainMenu.tsx'
import Test from './screens/test/test.tsx'

import { BrowserRouter, Routes, Route } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
