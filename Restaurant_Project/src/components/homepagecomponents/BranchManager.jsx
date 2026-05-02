import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, ChevronRight } from "lucide-react"

export function BranchManager() {
    const [managers, setManagers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/branch-managers')
                const data = await res.json()
                setManagers(data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching managers:", error)
                setLoading(false)
            }
        }
        fetchManagers()
    }, [])

    return (
        <div className="flex-1 flex flex-col h-full bg-white/40 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Branch Managers</h2>
                        <p className="text-xs font-medium text-slate-500">Active personnel directory</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="flex flex-col gap-3 pr-2 pb-2">
                    {loading ? (
                        <div className="flex items-center gap-2 justify-center py-8">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                            <p className="text-sm font-bold text-slate-500">Loading directory...</p>
                        </div>
                    ) : managers.length === 0 ? (
                        <p className="text-sm font-bold text-slate-500 text-center py-8">No managers found.</p>
                    ) : (
                        managers.map((manager) => (
                            <div 
                                key={manager.id} 
                                className="group flex items-center justify-between p-3 rounded-2xl bg-white/60 hover:bg-white border border-white/60 hover:border-primary/20 hover:shadow-md transition-all cursor-pointer shrink-0"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${manager.full_name}`} />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                            {manager.full_name ? manager.full_name.substring(0, 2).toUpperCase() : 'MG'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800 leading-none mb-1">{manager.full_name}</h4>
                                        <p className="text-xs font-medium text-slate-500 leading-none">Regional Manager</p>
                                    </div>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <ChevronRight className="h-4 w-4" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
