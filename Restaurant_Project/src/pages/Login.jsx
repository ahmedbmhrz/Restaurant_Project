import { useState } from "react"
import { Link } from "react-router-dom"
import { Pizza, Mail, Lock, Eye, EyeOff, ArrowRight, Github, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans select-none">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xl mb-4 group hover:scale-110 transition-transform duration-300">
            <Pizza className="h-7 w-7 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl capitalize">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Enter your credentials to access your restaurant empire.
          </p>
        </div>

        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6 pt-8 px-8">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Log in to Nexus Food
            </CardTitle>
            <CardDescription className="text-slate-400 font-medium text-xs uppercase tracking-widest">
              Security by Antigravity AI
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
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

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-11 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-colors">
                  <Github className="h-4 w-4 mr-2" /> GitHub
                </Button>
                <Button variant="outline" className="h-11 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-colors">
                  <Chrome className="h-4 w-4 mr-2" /> Google
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="px-8 py-6 bg-slate-50/50 border-t border-slate-100/50 justify-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline transition-all underline-offset-4 decoration-2">Create an account</Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer info */}
        <p className="px-8 text-center text-xs leading-relaxed text-slate-400 font-medium max-w-sm mx-auto">
          By clicking continue, you agree to our{" "}
          <Link to="#" className="hover:text-slate-900 underline transition-colors">Terms of Service</Link>{" "}
          and{" "}
          <Link to="#" className="hover:text-slate-900 underline transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
