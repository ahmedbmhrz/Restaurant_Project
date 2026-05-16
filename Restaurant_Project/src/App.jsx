import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from "./pages/Home"
import Branches from "./pages/Branches"
import AIPrediction from "./pages/AIPrediction"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import BranchManagerDashboard from "./pages/BranchManagerDashboard"
import BranchManagerLogin from "./pages/BranchManagerLogin"

import { TooltipProvider } from "@/components/ui/tooltip"

function App() {
  return (
    <TooltipProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/ai-prediction" element={<AIPrediction />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/branch-login" element={<BranchManagerLogin />} />
          <Route path="/branch-dashboard" element={<BranchManagerDashboard />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  )
}

export default App