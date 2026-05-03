import { useState, useEffect } from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    User, 
    Mail, 
    Shield, 
    Camera, 
    Loader2, 
    Check,
    AlertCircle,
    UserCircle
} from "lucide-react"
import { supabase } from "../../lib/supabase"

export function AccountSettingsModal({ isOpen, onClose, user }) {
    const [fullName, setFullName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (user) {
            setFullName(user?.user_metadata?.full_name || "");
        }
    }, [user, isOpen]);

    const handleUpdateProfile = async () => {
        setIsSaving(true);
        setStatus(null);
        setErrorMsg("");

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (error) throw error;

            setStatus('success');
            // Notify other components to refresh auth state if needed
            window.dispatchEvent(new Event('authChange'));
            
            // Close after a short delay to show success
            setTimeout(() => {
                onClose();
                setStatus(null);
            }, 1500);

        } catch (error) {
            console.error("Update Error:", error);
            setStatus('error');
            setErrorMsg(error.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const firstName = fullName.split(' ')[0] || "Nexus";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-2xl border-white/40 shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative group">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-4 ring-indigo-500/10">
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-2xl font-black">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-16 space-y-8">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight text-slate-800">Account Settings</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-slate-500">
                            Personalize your profile and security preferences.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 opacity-60">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security Role</Label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input 
                                        className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed"
                                        value="System Administrator"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 opacity-60">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input 
                                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed"
                                    value={user?.email || ""}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {status === 'success' && (
                        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                            <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                <Check className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-bold">Profile updated successfully!</span>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl border border-rose-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="h-5 w-5" />
                            <span className="text-sm font-bold">{errorMsg}</span>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button 
                            variant="ghost" 
                            onClick={onClose}
                            className="flex-1 h-12 rounded-2xl font-bold text-slate-500 hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdateProfile}
                            disabled={isSaving || !fullName}
                            className="flex-[2] h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 gap-2"
                        >
                            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserCircle className="h-5 w-5" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
