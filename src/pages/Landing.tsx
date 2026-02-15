import { motion, type Variants } from 'framer-motion';
import { Stethoscope, Activity, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { GlassCard } from '../components/ui/GlassCard';
import { GlowingOrb } from '../components/ui/GlowingOrb';
import { PulseButton } from '../components/ui/PulseButton';
import { GridBackground } from '../components/ui/GridBackground';
import { ScannerEffect } from '../components/ui/ScannerEffect';
import { HeroParallax } from '../components/ui/HeroParallax';
import { VitalButton } from '../components/ui/VitalButton';
import { DecodingText } from '../components/ui/DecodingText';

export function Landing() {
    const navigate = useNavigate();
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 selection:bg-medical-blue-100">

            {/* Background Elements */}
            <GridBackground />
            <ScannerEffect />

            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <GlowingOrb className="top-[-10%] left-[-10%] w-[600px] h-[600px] bg-medical-blue-300/30" delay={0} />
                <GlowingOrb className="bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-glow/20" delay={2} />
                <GlowingOrb className="top-[40%] left-[20%] w-[300px] h-[300px] bg-medical-blue-200/20" delay={4} />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center glass rounded-full px-8 py-4 bg-white/40 backdrop-blur-md border border-white/30 shadow-lg">
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/login">
                            <VitalButton className="px-6 py-2 text-sm shadow-md shadow-medical-blue-600/10">
                                Get Started
                            </VitalButton>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                        <motion.div
                            className="text-left"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-medical-blue-100 text-medical-blue-700 text-sm font-medium mb-8 backdrop-blur-md shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-medical-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-medical-blue-500"></span>
                                </span>
                                Next-GEN AI Triage System
                            </motion.div>

                            <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                                {/* Decoding Text Effect */}
                                <span className="block">AI-Powered</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-blue-600 via-cyan-500 to-cyan-glow animate-gradient-x">
                                    <DecodingText text="Smart Triage" />
                                </span>
                            </motion.h1>

                            <motion.p variants={itemVariants} className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed font-light mt-4">
                                for <span className="text-slate-600 font-medium">Modern Healthcare</span>
                                <br />
                                Experience the future of patient prioritization. Real-time AI risk assessment, intelligent queuing, and seamless hospital integration.
                            </motion.p>

                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
                                <Link to="/login">
                                    <VitalButton className="px-8 py-4 text-lg shadow-lg shadow-medical-blue-600/20">
                                        <User className="w-5 h-5" />
                                        Quick Health Check
                                        <ArrowRight className="w-5 h-5" />
                                    </VitalButton>
                                </Link>

                                <Link to="/login">
                                    <button className="flex items-center gap-2 px-8 py-4 bg-white/80 hover:bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-lg transition-all hover:shadow-md backdrop-blur-sm">
                                        <Stethoscope className="w-5 h-5" />
                                        Nurse Dashboard
                                    </button>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Hero Visual with Parallax */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="relative hidden lg:block"
                        >
                            <HeroParallax>
                                <div className="relative z-10 rounded-3xl overflow-hidden glass shadow-2xl group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-medical-blue-600/20 to-transparent mix-blend-overlay z-20 pointer-events-none" />
                                    <img
                                        src="/hero-bg.png"
                                        alt="Futuristic Medical Interface"
                                        className="w-full h-auto object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
                                    />

                                    {/* Floating UI Elements */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute top-10 right-10 p-4 rounded-xl glass bg-black/40 backdrop-blur-xl border border-white/10 z-30"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-white font-mono text-xs">SYSTEM ONLINE</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </HeroParallax>
                            {/* Glow behind image */}
                            <div className="absolute inset-0 bg-cyan-glow/30 blur-[100px] -z-10 rounded-full transform translate-y-20 pointer-events-none" />
                        </motion.div>
                    </div>

                    {/* Cards Section */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <GlassCard className="group h-full">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100">
                                <Activity className="w-7 h-7 text-medical-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-medical-blue-700 transition-colors">Enter Symptoms</h3>
                            <p className="text-slate-500 leading-relaxed font-light">
                                Describe your symptoms in natural language. Our AI understands medical context and vital variations instantly.
                            </p>
                        </GlassCard>

                        <GlassCard className="group h-full">
                            <div className="w-14 h-14 rounded-2xl bg-cyan-50/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-cyan-100">
                                <ShieldCheck className="w-7 h-7 text-cyan-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-cyan-700 transition-colors">AI Risk Analysis</h3>
                            <p className="text-slate-500 leading-relaxed font-light">
                                Hybrid AI models analyze your data against millions of cases to determine risk level with 99% accuracy.
                            </p>
                        </GlassCard>

                        <GlassCard className="group h-full">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-indigo-100">
                                <ArrowRight className="w-7 h-7 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-indigo-700 transition-colors">Smart Prioritization</h3>
                            <p className="text-slate-500 leading-relaxed font-light">
                                Get instantly routed to the right department. Live queue updates and estimated waiting times.
                            </p>
                        </GlassCard>
                    </motion.div>

                    {/* Emergency Section */}
                    <motion.div
                        className="text-center relative py-20 rounded-3xl overflow-hidden glass border border-white/50"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Animated Grid Background for this section */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emergency-red/5 to-transparent blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold mb-6 uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                Emergency Protocol
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Critical Condition?</h2>
                            <PulseButton onClick={() => {
                                navigate('/triage-result', {
                                    state: {
                                        result: { risk_level: 'CRITICAL', sos: true },
                                        patientId: 'EMERGENCY-SOS',
                                        patientName: 'Unknown (SOS)',
                                        vitals: { bp: '--/--', hr: '--', temp: '--' }
                                    }
                                });
                            }} />
                            <p className="mt-8 text-sm text-slate-400 max-w-md mx-auto font-medium">
                                Press immediately if you are experiencing severe symptoms like <span className="text-slate-600">chest pain</span>, <span className="text-slate-600">difficulty breathing</span>, or <span className="text-slate-600">severe bleeding</span>.
                            </p>
                            <p className="mt-2 text-xs text-slate-400/80 font-medium">
                                * No login required for emergency access.
                            </p>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <footer className="mt-32 border-t border-slate-200 pt-10 text-center pb-10">
                        <p className="text-slate-400 text-sm font-medium">
                            © 2025 MediVerse Hospitals. Empowering Healthcare with AI.
                        </p>
                        <div className="mt-6 flex justify-center gap-8 text-sm text-slate-500">
                            <a href="#" className="hover:text-medical-blue-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-medical-blue-600 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-medical-blue-600 transition-colors">Medical Disclaimer</a>
                        </div>
                    </footer>

                </div>
            </main>
        </div>
    );
}
