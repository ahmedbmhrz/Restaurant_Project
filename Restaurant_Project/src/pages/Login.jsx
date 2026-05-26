import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginHeader } from "../components/loginComponents/LoginHeader"
import { LoginForm } from "../components/loginComponents/LoginForm"
import { LoginSocials } from "../components/loginComponents/LoginSocials"
import { LoginFooter } from "../components/loginComponents/LoginFooter"

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans select-none">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative">
        <LoginHeader />

        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6 pt-8 px-8">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              Log in to Nexus Food
            </CardTitle>
            <CardDescription className="text-slate-400 font-medium text-xs uppercase tracking-widest">
              Welcome! Please enter your details
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <LoginForm />
            <LoginSocials />
          </CardContent>
          <CardFooter className="px-8 py-6 bg-slate-50/50 border-t border-slate-100/50 justify-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline transition-all underline-offset-4 decoration-2">Create an account</Link>
            </p>
          </CardFooter>
        </Card>

        <LoginFooter />
      </div>
    </div>
  )
}
