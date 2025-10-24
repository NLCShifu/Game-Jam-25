import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainMenu from './screens/MainMenu/MainMenu.tsx'
import Test from './screens/test/test.tsx'
import Cursor from './components/Cursor.tsx'

import { BrowserRouter, Routes, Route } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Cursor rippleOffset={{ x: -9, y: -7 }} />
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
