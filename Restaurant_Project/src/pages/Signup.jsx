import { useState } from "react"
import { Link } from "react-router-dom"
import { Pizza, Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate signup
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans select-none">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xl mb-4 group hover:scale-110 transition-transform duration-300">
            <Pizza className="h-7 w-7 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl capitalize">
            Join the Empire
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Create your account and start managing your restaurant network.
          </p>
        </div>

        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6 pt-8 px-8">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Create New Account
            </CardTitle>
            <CardDescription className="text-slate-400 font-medium text-xs uppercase tracking-widest">
              Join Nexus Food Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
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
          </CardContent>
          <CardFooter className="px-8 py-6 bg-slate-50/50 border-t border-slate-100/50 justify-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline transition-all underline-offset-4 decoration-2">Log in here</Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer info */}
        <p className="px-8 text-center text-xs leading-relaxed text-slate-400 font-medium max-w-sm mx-auto">
          Secure onboarding powered by Nexus Food Identity System. 🛡️
        </p>
      </div>
    </div>
  )
}
