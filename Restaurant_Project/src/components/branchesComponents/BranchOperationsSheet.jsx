import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Building2, Activity, AlertCircle } from "lucide-react"

export function BranchOperationsSheet({ data }) {
    if (!data) return null;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className="w-full transition-all duration-300 hover:gap-3 group/btn"
                    variant="default"
                >
                    Manage Branch Operations
                    <Building2 className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto" style={{ minWidth: 'min(90vw, 600px)' }}>
                <div className="mx-auto max-w-[420px] w-full pt-2 sm:pt-8 pb-8">
                    <SheetHeader className="pb-6 border-b">
                        <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-primary" />
                            Settings: {data.name}
                        </SheetTitle>
                        <SheetDescription className="text-base">
                            Configure live operational settings and controls for this location.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-8 space-y-10">
                        {/* Order Settings Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                                <Activity className="h-4 w-4" /> Live Operations
                            </h3>

                            <div className="flex items-center justify-between rounded-2xl border p-5 bg-card shadow-sm hover:shadow-md transition-shadow cursor-default">
                                <div className="space-y-1 mr-4">
                                    <Label className="text-base font-bold">Accept Online Orders</Label>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Allow customers to seamlessly place new delivery and pickup orders via the Nexus Food mobile app.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between rounded-2xl border p-5 bg-card shadow-sm hover:shadow-md transition-shadow cursor-default">
                                <div className="space-y-1 mr-4">
                                    <Label className="text-base font-bold">Peak Dynamic Pricing</Label>
                                    <p className="text-sm text-muted-foreground leading-relaxed">Enable automated pricing adjustments during rush hours to optimally balance demand.</p>
                                </div>
                                <Switch />
                            </div>
                        </div>

                        {/* Danger Zone Section */}
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-sm font-bold tracking-widest uppercase text-rose-500 flex items-center gap-2 mb-6">
                                <AlertCircle className="h-4 w-4" /> Emergency Controls
                            </h3>

                            <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-sm cursor-default">
                                <div className="space-y-1 mr-4">
                                    <Label className="text-base font-bold text-rose-700">Pause Kitchen Queue</Label>
                                    <p className="text-sm text-rose-600/90 leading-relaxed">Temporarily block all incoming digital orders to allow the kitchen staff to clear the current backlog.</p>
                                </div>
                                <Switch className="data-[state=checked]:bg-rose-600" />
                            </div>

                            <Button variant="destructive" className="w-full mt-4 h-12 text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)] transition-all">
                                FORCE CLOSE BRANCH IMMEDIATELY
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
