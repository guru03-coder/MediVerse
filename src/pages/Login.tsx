import { motion } from 'framer-motion';
import { ArrowRight, Lock, User, Building, Smartphone, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GridBackground } from '../components/ui/GridBackground';
import { GlowingOrb } from '../components/ui/GlowingOrb';
import { VitalButton } from '../components/ui/VitalButton';
import { Logo } from '../components/ui/Logo';

export function Login() {
    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 selection:bg-medical-blue-100 flex items-center justify-center p-6">

            {/* Background Elements */}
            <GridBackground />
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <GlowingOrb className="top-[-10%] left-[-10%] w-[600px] h-[600px] bg-medical-blue-200/30" delay={0} />
                <GlowingOrb className="bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-100/40" delay={2} />
            </div>

            <motion.div
                className="relative z-10 w-full max-w-5xl bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >

                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
                    <Link to="/" className="pointer-events-auto hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>
                </div>

                {/* Left Side - Staff Login */}
                <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-200/50 relative bg-white/40">

                    <div className="relative z-10 h-full flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-blue-50 text-medical-blue-600 text-xs font-medium mb-4 border border-medical-blue-100">
                                <Lock className="w-3 h-3" />
                                Staff Access
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Secure Hospital Login</h2>
                            <p className="text-slate-500 text-sm">Authorized personnel only. Please verify your credentials.</p>
                        </div>

                        <form className="space-y-5">
                            <div className="flex justify-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-white border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                                    <User className="w-8 h-8 opacity-50" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-medical-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Staff ID / Email"
                                        className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-medical-blue-500 focus:ring-1 focus:ring-medical-blue-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-medical-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-medical-blue-500 focus:ring-1 focus:ring-medical-blue-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="relative group">
                                    <Building className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-medical-blue-500 transition-colors" />
                                    <select className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-medical-blue-500 focus:ring-1 focus:ring-medical-blue-500 transition-all appearance-none cursor-pointer text-sm">
                                        <option value="" disabled selected>Select Role</option>
                                        <option value="nurse">Nurse Practitioner</option>
                                        <option value="doctor">Doctor / Specialist</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                    <div className="absolute right-3 top-4 pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link to="/dashboard/nurse">
                                    <button type="button" className="w-full bg-medical-blue-600 hover:bg-medical-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-medical-blue-600/20 flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                        Access Dashboard
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side - Patient Quick Login */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-slate-50/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-green-100/50 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />

                    <div className="relative z-10 h-full flex flex-col justify-end">
                        <div className="mb-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-600/20">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Patient Quick Check-in</h2>
                            <p className="text-slate-500 text-sm mt-2">Skip the queue. Instant triage access.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">

                                <div className="relative group">
                                    <Smartphone className="absolute left-3 top-3.5 w-5 h-5 text-green-600/70" />
                                    <input
                                        type="tel"
                                        placeholder="Mobile Number (OTP)"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-400 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">OR</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-green-600/70" />
                                    <input
                                        type="text"
                                        placeholder="Patient ID (if returning)"
                                        className="w-full bg-white border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-slate-400 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link to="/intake" className="w-full">
                                    <VitalButton className="w-full bg-green-600 hover:bg-green-700 border-green-600 py-3.5 text-base shadow-green-600/20 text-white">
                                        Continue as Patient
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </VitalButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </motion.div>

            {/* Back to Home Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-8 z-20"
            >
                <Link to="/">
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 backdrop-blur-md border border-white/50 text-slate-600 font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Back to Home
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
