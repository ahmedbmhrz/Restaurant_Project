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
  const [userRole, setUserRole] = useState(null);

  const isElectron = navigator.userAgent.toLowerCase().includes(' electron/');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Check user role in the database
          const { data: dbUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (dbUser?.role === 'Branch Manager') {
            setUserRole('branch_manager');
          } else {
            setUserRole('hq_manager');
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in: desktop app goes to branch login, web goes to HQ login
  if (!user) {
    return isElectron ? <Navigate to="/branch-login" /> : <Navigate to="/login" />;
  }
  
  // If logged in: desktop app always goes to branch dashboard
  if (isElectron) {
    return <Navigate to="/branch-dashboard" />;
  }

  // Web users go to branch dashboard ONLY if they are explicitly a branch manager
  return userRole === 'branch_manager' ? <Navigate to="/branch-dashboard" /> : <Navigate to="/home" />;
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