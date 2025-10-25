import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainMenu from './screens/MainMenu/MainMenu.tsx'
import WaitingRoom from './screens/WaitingRoom/WaitingRoom.tsx'
import Test from './screens/test/test.tsx'
import GameRoom from './screens/GameRoom/GameRoom.tsx'

import Cursor from './components/Cursor.tsx'

import { BrowserRouter, Routes, Route } from 'react-router'

import "./assets/fonts/Yourmate/Yourmate.ttf"
import WebcamTest from './screens/WebcamTest/WebcamTest.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
