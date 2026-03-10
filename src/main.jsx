import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Pages/Home'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register'
import Download from './Pages/Download'
import Updates from './Pages/Updates'
import Profile from './Pages/Profile'
import Donate from './Pages/Donate'
import FAQ from './Pages/FAQ'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Download' element={<Download />} />
          <Route path='/Updates' element={<Updates />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/Donate' element={<Donate />} />
          <Route path='/FAQ' element={<FAQ />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
