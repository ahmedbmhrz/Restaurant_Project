import { Pizza } from "lucide-react"

export function SignupHeader() {
  return (
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
  )
}
