import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
    CreditCard, 
    CheckCircle2, 
    Zap, 
    Calendar, 
    ArrowUpRight,
    Lock,
    Clock,
    DollarSign
} from "lucide-react"

export function BillingModal({ isOpen, onClose }) {
    const plans = [
        {
            name: "Enterprise",
            price: "$499",
            status: "Current Plan",
            current: true,
            features: ["Unlimited Branches", "AI Predictive Analytics", "Priority Support", "Custom Integrations", "Advanced Reporting"]
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl bg-white/95 backdrop-blur-2xl border-white/40 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                <div className="p-8 space-y-8">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-3xl font-black tracking-tight text-slate-800">Billing & Subscription</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            Manage your payment methods and subscription plan.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Current Plan Card */}
                    <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Zap className="h-32 w-32" />
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Current active plan</span>
                                    <h3 className="text-4xl font-black mt-1">Enterprise Pro</h3>
                                </div>
                                <div className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                                    Active
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar className="h-3 w-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Next Billing Date</span>
                                    </div>
                                    <p className="text-lg font-bold italic">June 15, 2026</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <DollarSign className="h-3 w-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Billing Amount</span>
                                    </div>
                                    <p className="text-lg font-bold italic">$499.00 / mo</p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button className="flex-1 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold h-11">
                                    Manage Subscription
                                </Button>
                                <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/10 rounded-xl font-bold h-11">
                                    View Invoices
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Included in your plan</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {plans[0].features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                    <span className="text-xs font-bold text-slate-600">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                <div className="h-8 w-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[8px] text-slate-400 uppercase">Visa</div>
                            </div>
                            <div className="text-[10px] font-bold text-slate-500">
                                <span className="text-slate-400">Primary card ending in</span> •••• 4242
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-indigo-600 font-bold hover:bg-indigo-50 rounded-lg gap-1">
                            Change <ArrowUpRight className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
