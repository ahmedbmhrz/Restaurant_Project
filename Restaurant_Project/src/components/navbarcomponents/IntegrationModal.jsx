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
    Settings, 
    Check, 
    Plus, 
    ExternalLink,
    MessageSquare,
    CreditCard,
    Truck,
    LineChart,
    Wifi,
    Cloud
} from "lucide-react"

export function IntegrationModal({ isOpen, onClose }) {
    const [integrations, setIntegrations] = useState([
        {
            id: 'stripe',
            name: 'Stripe',
            category: 'Payments',
            description: 'Process global payments and manage payouts.',
            connected: true,
            icon: <CreditCard className="h-5 w-5 text-indigo-600" />,
            color: 'bg-indigo-50'
        },
        {
            id: 'doordash',
            name: 'DoorDash',
            category: 'Delivery',
            description: 'Sync orders and inventory with DoorDash Drive.',
            connected: true,
            icon: <Truck className="h-5 w-5 text-rose-600" />,
            color: 'bg-rose-50'
        },
        {
            id: 'slack',
            name: 'Slack',
            category: 'Communication',
            description: 'Get real-time alerts for orders and branch activity.',
            connected: false,
            icon: <MessageSquare className="h-5 w-5 text-emerald-600" />,
            color: 'bg-emerald-50'
        },
        {
            id: 'quickbooks',
            name: 'QuickBooks',
            category: 'Accounting',
            description: 'Automate your bookkeeping and tax reporting.',
            connected: false,
            icon: <LineChart className="h-5 w-5 text-blue-600" />,
            color: 'bg-blue-50'
        }
    ]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-2xl border-white/40 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                <div className="p-8 space-y-8">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                                <Settings className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-3xl font-black tracking-tight text-slate-800">Integrations</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            Connect your favorite tools to supercharge your workflow.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {integrations.map((app) => (
                            <div 
                                key={app.id}
                                className="group p-5 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 hover:border-slate-200 transition-all duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${app.color} transition-transform group-hover:scale-110 duration-300`}>
                                        {app.icon}
                                    </div>
                                    {app.connected ? (
                                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                            <Check className="h-3 w-3" /> Connected
                                        </div>
                                    ) : (
                                        <Button size="sm" variant="outline" className="h-7 rounded-full text-[10px] font-black uppercase tracking-widest gap-1 border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                                            <Plus className="h-3 w-3" /> Connect
                                        </Button>
                                    )}
                                </div>
                                
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-black text-slate-800 text-lg tracking-tight">{app.name}</h4>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-2 py-0.5 rounded-md uppercase">{app.category}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {app.description}
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                        Manage Settings <ExternalLink className="h-2.5 w-2.5" />
                                    </button>
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                                        <Wifi className="h-3 w-3" /> Live
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-indigo-50 rounded-3xl p-6 flex items-center justify-between border border-indigo-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                <Cloud className="h-6 w-6" />
                            </div>
                            <div>
                                <h5 className="font-bold text-indigo-900 text-sm">Need a custom integration?</h5>
                                <p className="text-xs text-indigo-700/70 font-medium mt-0.5">Our developers can build bespoke connections for your API.</p>
                            </div>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold px-6">
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
