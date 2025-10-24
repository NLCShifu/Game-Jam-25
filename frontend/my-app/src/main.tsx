import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainMenu from './screens/MainMenu/MainMenu.tsx'
import WaitingRoom from './screens/WaitingRoom/WaitingRoom.tsx'
import Test from './screens/test/test.tsx'

import { BrowserRouter, Routes, Route } from 'react-router'

import "./assets/fonts/Yourmate/Yourmate.ttf"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/:room_id/:session_id/waiting" element={<WaitingRoom />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
