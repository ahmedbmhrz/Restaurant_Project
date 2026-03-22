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
                <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/30 p-3 transition-all hover:shadow-md cursor-default">
                    <div className="space-y-0.5 pr-4">
                        <Label className="text-xs font-bold text-rose-900">Block New Orders</Label>
                        <p className="text-[10px] text-rose-600/70 font-medium">Pause all incoming traffic.</p>
                    </div>
                    <Switch className="scale-75 data-[state=checked]:bg-rose-600" />
                </div>

                <Button variant="destructive" className="w-full h-10 text-[10px] font-black rounded-lg shadow-md shadow-rose-500/5 hover:bg-rose-600 transition-all uppercase tracking-widest">
                    Shutdown Branch Instance
                </Button>
            </div>
        </div>
    );
}
