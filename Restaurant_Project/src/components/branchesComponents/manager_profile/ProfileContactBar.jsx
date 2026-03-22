import { Mail, Phone } from "lucide-react"

export function ProfileContactBar({ email, phone }) {
    return (
        <div className="grid grid-cols-2 gap-4 bg-slate-50/40 p-3 rounded-2xl border border-dashed border-slate-200/60 w-full">
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 hover:text-amber-600 cursor-pointer overflow-hidden truncate">
                <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100 shrink-0">
                    <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 hover:text-amber-600 cursor-pointer shrink-0">
                <div className="p-1.5 rounded-lg bg-white shadow-sm border border-slate-100">
                    <Phone className="h-3.5 w-3.5" />
                </div>
                {phone}
            </div>
        </div>
    );
}
