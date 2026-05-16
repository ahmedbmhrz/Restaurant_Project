import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Pizza, ArrowRight, Loader2 } from 'lucide-react';

export default function BranchManagerLogin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleMockLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate a network request for the mock login
        setTimeout(() => {
            setIsLoading(false);
            // Navigate directly to the dashboard
            navigate('/branch-dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans select-none relative overflow-hidden">
            {/* Dark, secure aesthetic background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
            </div>

            <div className="w-full max-w-[400px] z-10 px-4">
                {/* Brand Header */}
                <div className="flex flex-col items-center justify-center mb-8 text-white">
                    <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-4 shadow-2xl">
                        <Pizza className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight">Nexus Food System</h1>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Branch Terminal</p>
                </div>

                <Card className="border-none shadow-2xl bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden relative">
                    {/* Glowing top border effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-500" />
                    
                    <CardHeader className="space-y-1 pb-6 pt-8 px-8 text-center">
                        <div className="mx-auto bg-slate-800/50 w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-white/10">
                            <Lock className="h-5 w-5 text-emerald-400" />
                        </div>
                        <CardTitle className="text-xl font-bold text-white">
                            Manager Access
                        </CardTitle>
                        <CardDescription className="text-slate-400 font-medium text-xs">
                            Please authenticate to unlock the dashboard.
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="px-8 pb-8">
                        <form onSubmit={handleMockLogin} className="space-y-5">
                            <div className="space-y-2">
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
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label className="text-slate-300 text-xs font-bold uppercase tracking-wider">Passcode</Label>
                                </div>
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
                                className="w-full h-12 mt-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
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
                        </form>
                    </CardContent>
                </Card>
                
                <div className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <p>Terminal ID: NK-402 • Secure Connection</p>
                </div>
            </div>
        </div>
    );
}
