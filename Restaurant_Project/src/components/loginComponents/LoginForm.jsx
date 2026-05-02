import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Simulate network request
    setTimeout(() => {
      setIsLoading(false)
      
      // DUMMY AUTHENTICATION LOGIC
      if (email === "admin@nexus.com" && password === "password123") {
        // Success! Redirect to the dashboard
        navigate("/")
      } else {
        // Fail! Show error message
        setError("Invalid email or password. (Hint: use admin@nexus.com / password123)")
      }
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            id="email" 
            type="email" 
            placeholder="admin@nexus.com" 
            required 
            className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between ml-1">
          <Label htmlFor="password" title="password" className="text-sm font-bold text-slate-700">Password</Label>
          <Link to="#" className="text-xs font-bold text-primary hover:underline transition-all">Forgot password?</Link>
        </div>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            required 
            className="pl-10 pr-10 h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl font-medium"
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all overflow-hidden relative group"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Signing in...</span>
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2">
            Access Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  )
}
