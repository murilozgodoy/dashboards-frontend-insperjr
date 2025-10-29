import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Temporal from './pages/Temporal'
import Geografica from './pages/Geografica'
import Plataformas from './pages/Plataformas'
import Operacional from './pages/Operacional'
import Rentabilidade from './pages/Rentabilidade'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/temporal" element={<Temporal />} />
        <Route path="/geografica" element={<Geografica />} />
        <Route path="/plataformas" element={<Plataformas />} />
        <Route path="/operacional" element={<Operacional />} />
        <Route path="/rentabilidade" element={<Rentabilidade />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
