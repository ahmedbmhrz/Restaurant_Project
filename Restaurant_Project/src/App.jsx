import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Home from "./pages/Home"
import Branches from "./pages/Branches"
import AIPrediction from "./pages/AIPrediction"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import BranchManagerDashboard from "./pages/BranchManagerDashboard"
import BranchManagerLogin from "./pages/BranchManagerLogin"

import { TooltipProvider } from "@/components/ui/tooltip"

function RootRoute() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
}

function App() {
  return (
    <TooltipProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
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