import { useState } from "react"
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate signup
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullname" className="text-sm font-bold text-slate-700 ml-1">Full Name</Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            id="fullname"
            type="text"
            placeholder="Name Surname"
            required
            className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder="Email"
            required
            className="pl-10 h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-primary focus-visible:bg-white transition-all rounded-xl font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" title="password" className="text-sm font-bold text-slate-700 ml-1">Password</Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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

      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10 mb-2 mt-1">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
        <p className="text-[10px] sm:text-xs text-slate-600 font-medium leading-tight">
          By signing up, you gain instant access to AI forecasting and multi-branch management tools.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all overflow-hidden relative group mt-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span>Creating account...</span>
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2 uppercase tracking-wide">
            Sign Up Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  )
}
