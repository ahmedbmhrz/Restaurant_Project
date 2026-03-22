import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"

export function ProfileBanner({ avatarSrc, avatarFallback }) {
    return (
        <div className="relative h-32 bg-linear-to-br from-amber-500/15 via-orange-500/5 to-transparent">
            {/* Floating Decorative Icon */}
            <div className="absolute top-4 right-8 opacity-5 scale-125">
                <ShieldCheck className="h-32 w-32 text-amber-600" />
            </div>
            
            {/* Bordered Avatar */}
            <div className="absolute -bottom-12 left-10 p-1 bg-white rounded-[2rem] shadow-xl overflow-hidden ring-4 ring-white">
                <Avatar className="h-24 w-24 rounded-[1.75rem] shadow-inner">
                    <AvatarImage src={avatarSrc} className="object-cover" />
                    <AvatarFallback className="text-3xl font-black bg-amber-500/10 text-amber-600">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Verified Badge */}
            <div className="absolute top-4 left-10 flex gap-2">
                 <Badge variant="outline" className="bg-white/60 backdrop-blur-md border-white/40 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 text-slate-700">
                    Verified Profile
                 </Badge>
            </div>
        </div>
    );
}
