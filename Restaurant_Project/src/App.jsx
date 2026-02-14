import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from "./pages/home"
import Branches from "./pages/Branches"
import AIPrediction from "./pages/AIPrediction"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/ai-prediction" element={<AIPrediction />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App