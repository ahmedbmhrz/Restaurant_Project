import { Phone, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LoginSocials() {
  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button" className="h-11 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-colors">
          <Phone className="h-4 w-4 mr-2" /> Phone
        </Button>
        <Button variant="outline" type="button" className="h-11 rounded-xl font-bold border-slate-200 hover:bg-slate-50 transition-colors">
          <Chrome className="h-4 w-4 mr-2" /> Google
        </Button>
      </div>
    </>
  )
}
