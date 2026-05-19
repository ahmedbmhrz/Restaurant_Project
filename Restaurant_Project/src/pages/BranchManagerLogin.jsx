import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Pizza, ArrowRight, Loader2, KeyRound, AlertCircle, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BranchManagerLogin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    
    // Normal Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Activation State
    const [accessCode, setAccessCode] = useState('');
    const [fullName, setFullName] = useState('');
    const [actEmail, setActEmail] = useState('');
    const [actPassword, setActPassword] = useState('');
    
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleStandardLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Verify role in public.users to prevent unauthorized access
            const { data: profile, error: profileErr } = await supabase
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .maybeSingle();
                
            if (profileErr) throw profileErr;
            
            if (profile?.role !== 'Branch_Manager' && profile?.role !== 'Manager') {
                await supabase.auth.signOut();
                throw new Error("Access Denied: Terminal restricted to Branch Managers.");
            }
            
            setSuccessMsg("Terminal Unlocked! Redirecting...");
            setTimeout(() => {
                navigate('/branch-dashboard');
            }, 1000);
        } catch (err) {
            console.error("Login failed:", err);
            setErrorMsg(err.message || "Invalid credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivation = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        
        try {
            const res = await fetch("http://localhost:5000/api/branch-manager/activate-terminal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accessCode,
                    email: actEmail,
                    password: actPassword,
                    fullName
                })
            });
            
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.error || "Failed to activate terminal.");
            }
            
            // Sign in the client directly
            const { error: signInErr } = await supabase.auth.signInWithPassword({
                email: actEmail,
                password: actPassword
            });
            
            if (signInErr) throw signInErr;
            
            setSuccessMsg("Terminal Activated successfully! Redirecting...");
            setTimeout(() => {
                navigate('/branch-dashboard');
            }, 1500);
        } catch (err) {
            console.error("Activation failed:", err);
            setErrorMsg(err.message || "Failed to activate branch terminal.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans select-none relative overflow-hidden">
            {/* Dark, secure aesthetic background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
            </div>

            <div className="w-full max-w-[420px] z-10 px-4">
                {/* Brand Header */}
                <div className="flex flex-col items-center justify-center mb-6 text-white">
                    <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-4 shadow-2xl">
                        <Pizza className="h-8 w-8 text-emerald-400 animate-pulse" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">Nexus Food System</h1>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Branch Terminal</p>
                </div>

                <Card className="border-none shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                    {/* Glowing top border effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-500" />
                    
                    <CardHeader className="space-y-1 pb-4 pt-6 px-8 text-center">
                        <div className="mx-auto bg-slate-800/50 w-12 h-12 rounded-full flex items-center justify-center mb-2 border border-white/10">
                            {isActivating ? (
                                <KeyRound className="h-5 w-5 text-indigo-400" />
                            ) : (
                                <Lock className="h-5 w-5 text-emerald-400" />
                            )}
                        </div>
                        <CardTitle className="text-xl font-bold text-white">
                            {isActivating ? "Activate Store Terminal" : "Manager Access"}
                        </CardTitle>
                        <CardDescription className="text-slate-400 font-medium text-xs">
                            {isActivating 
                                ? "Claim your branch terminal using your activation code"
                                : "Please authenticate to unlock the dashboard"
                            }
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="px-8 pb-6">
                        {errorMsg && (
                            <div className="bg-rose-500/10 text-rose-400 text-xs font-semibold p-3.5 rounded-xl border border-rose-500/20 mb-4 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {successMsg && (
                            <div className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold p-3.5 rounded-xl border border-emerald-500/20 mb-4 flex items-center gap-2">
                                <UserCheck className="h-4 w-4 flex-shrink-0" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        {!isActivating ? (
                            /* --- Standard Login Form --- */
                            <form onSubmit={handleStandardLogin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Email ID</Label>
                                    <Input 
                                        type="email" 
                                        placeholder="manager@nexusfood.com" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Password</Label>
                                    <Input 
                                        type="password" 
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                    />
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full h-12 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            UNLOCK TERMINAL
                                            <ArrowRight className="h-5 w-5 opacity-70" />
                                        </>
                                    )}
                                </Button>

                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsActivating(true);
                                            setErrorMsg('');
                                            setSuccessMsg('');
                                        }}
                                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
                                    >
                                        Activate Branch with Code
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* --- Terminal Activation Form --- */
                            <form onSubmit={handleActivation} className="space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-1.5">
                                    <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Activation Code</Label>
                                    <Input 
                                        type="text" 
                                        placeholder="e.g. BM-X4Y8Z2" 
                                        required
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20 uppercase tracking-widest font-bold font-mono"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Manager Full Name</Label>
                                    <Input 
                                        type="text" 
                                        placeholder="e.g. John Doe" 
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Email ID</Label>
                                    <Input 
                                        type="email" 
                                        placeholder="manager@nexusfood.com" 
                                        required
                                        value={actEmail}
                                        onChange={(e) => setActEmail(e.target.value)}
                                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider ml-1">Create Password</Label>
                                    <Input 
                                        type="password" 
                                        required
                                        placeholder="Min 6 characters"
                                        value={actPassword}
                                        onChange={(e) => setActPassword(e.target.value)}
                                        className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                    />
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full h-12 mt-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <>
                                            ACTIVATE & LOG IN
                                            <ArrowRight className="h-5 w-5 opacity-70" />
                                        </>
                                    )}
                                </Button>

                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsActivating(false);
                                            setErrorMsg('');
                                            setSuccessMsg('');
                                        }}
                                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
                                    >
                                        Back to Secure Login
                                    </button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
                
                <div className="text-center mt-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <p>Terminal ID: NK-402 • Secure Connection</p>
                </div>
            </div>
        </div>
    );
}
