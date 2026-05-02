import { Link } from "react-router-dom"

export function LoginFooter() {
  return (
    <p className="px-8 text-center text-xs leading-relaxed text-slate-400 font-medium max-w-sm mx-auto">
      By clicking continue, you agree to our{" "}
      <Link to="#" className="hover:text-slate-900 underline transition-colors">Terms of Service</Link>{" "}
      and{" "}
      <Link to="#" className="hover:text-slate-900 underline transition-colors">Privacy Policy</Link>.
    </p>
  )
}
