import { useState } from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
    LifeBuoy, 
    Search, 
    BookOpen, 
    MessageCircle, 
    Mail, 
    ExternalLink,
    ChevronRight,
    PlayCircle,
    FileText
} from "lucide-react"

export function SupportModal({ isOpen, onClose }) {
    const faqs = [
        { q: "How do I add a new branch?", icon: <PlayCircle className="h-4 w-4 text-indigo-500" /> },
        { q: "Managing manager permissions", icon: <FileText className="h-4 w-4 text-blue-500" /> },
        { q: "Exporting monthly income reports", icon: <FileText className="h-4 w-4 text-emerald-500" /> },
        { q: "Connecting Stripe for payments", icon: <ExternalLink className="h-4 w-4 text-purple-500" /> }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl bg-white/95 backdrop-blur-2xl border-white/40 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                <div className="p-8 space-y-8">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                                <LifeBuoy className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-3xl font-black tracking-tight text-slate-800">Support Center</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            How can we help you today? Search our knowledge base or contact us.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] pl-12 pr-4 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-inner"
                            placeholder="Search for articles, guides..."
                        />
                    </div>

                    {/* Quick Help Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/30 transition-all cursor-pointer group">
                            <div className="p-3 rounded-2xl bg-indigo-600 text-white w-fit mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <h4 className="font-black text-slate-800">Documentation</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Read the full guide</p>
                        </div>
                        <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/30 transition-all cursor-pointer group">
                            <div className="p-3 rounded-2xl bg-emerald-500 text-white w-fit mb-4 group-hover:scale-110 transition-transform">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <h4 className="font-black text-slate-800">Live Chat</h4>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Available now</p>
                        </div>
                    </div>

                    {/* Popular Articles */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Popular Articles</h4>
                        <div className="space-y-2">
                            {faqs.map((faq, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        {faq.icon}
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{faq.q}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Support Button */}
                    <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest gap-2 shadow-xl shadow-slate-200">
                        <Mail className="h-5 w-5" />
                        Send a Message
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
