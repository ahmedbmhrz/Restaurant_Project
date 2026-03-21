import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export function EmergencyControls() {
    return (
        <div className="space-y-6 pt-6 border-t">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 flex items-center gap-2">
                <AlertCircle className="h-3 w-3" /> Emergency Controls
            </h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/30 p-4 transition-all hover:shadow-md cursor-default">
                    <div className="space-y-0.5 pr-4">
                        <Label className="text-sm font-bold text-rose-900">Block New Orders</Label>
                        <p className="text-[11px] text-rose-600/70 font-medium">Pause all incoming digital traffic immediately.</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-rose-600" />
                </div>

                <Button variant="destructive" className="w-full h-12 text-xs font-black rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.15)] hover:bg-rose-600 transition-all uppercase tracking-widest">
                    Shutdown Branch Instance
                </Button>
            </div>
        </div>
    );
}
