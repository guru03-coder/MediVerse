import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import {
    Activity, AlertTriangle, CheckCircle, ArrowRight, Printer, Share2
} from 'lucide-react';
import { GridBackground } from '../components/ui/GridBackground';

export function TriageResult() {
    const location = useLocation();
    const { result, patientId, vitals } = location.state || {}; // Expecting result, patientId, vitals from navigation state

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800">No Assessment Data Found</h2>
                    <p className="text-slate-500 mb-6">Please start a new patient intake.</p>
                    <Link to="/intake" className="px-6 py-3 bg-medical-blue-600 text-white rounded-xl font-medium">
                        Start Intake
                    </Link>
                </div>
            </div>
        );
    }

    const riskColors: any = {
        High: {
            bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700',
            badge: 'bg-red-100 text-red-800',
            ring: 'ring-red-100',
            icon: 'text-red-600',
            description: 'Immediate medical attention required. Critical condition.'
        },
        Medium: {
            bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700',
            badge: 'bg-amber-100 text-amber-800',
            ring: 'ring-amber-100',
            icon: 'text-amber-600',
            description: 'Urgent care needed. Monitor vitals closely.'
        },
        Low: {
            bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700',
            badge: 'bg-emerald-100 text-emerald-800',
            ring: 'ring-emerald-100',
            icon: 'text-emerald-600',
            description: 'Routine checkup. No immediate danger detected.'
        },
        CRITICAL: {
            bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800',
            badge: 'bg-red-200 text-red-900',
            ring: 'ring-red-200',
            icon: 'text-red-700',
            description: 'LIFE THREATENING EMERGENCY. ACT IMMEDIATELY.'
        },
        ERROR: {
            bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700',
            badge: 'bg-slate-100 text-slate-800',
            ring: 'ring-slate-100',
            icon: 'text-slate-500',
            description: 'System error. Please reassess manually.'
        },
    };

    const currentRisk = riskColors[result.risk_level] || riskColors.Low;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-medical-blue-100 flex flex-col overflow-hidden relative">
            <GridBackground />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-medical-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                    <span className="font-bold text-lg tracking-tight text-slate-800">
                        MediVerse <span className="text-slate-400 font-normal">Triage</span>
                    </span>
                </div>
                <Link to="/dashboard/nurse">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                        Close
                    </button>
                </Link>
            </header>

            <main className="flex-grow pt-28 px-6 pb-12 relative z-10 max-w-4xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            Assessment Complete - Patient #{patientId || 'UNKNOWN'}
                        </div>
                    </div>

                    {/* Main Result Card */}
                    <div className={`relative overflow-hidden rounded-3xl border-2 ${currentRisk.border} ${currentRisk.bg} p-8 md:p-12 shadow-xl`}>
                        <div className="absolute top-0 right-0 p-32 bg-white/40 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            {/* Risk Dial Visual */}
                            <div className="relative shrink-0">
                                <div className={`w-40 h-40 rounded-full border-8 ${currentRisk.border} flex items-center justify-center bg-white shadow-inner`}>
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">RISK LEVEL</div>
                                        <div className={`text-3xl font-black ${currentRisk.text}`}>{result.risk_level}</div>
                                    </div>
                                </div>
                                {/* Pulse Effect */}
                                <div className={`absolute inset-0 rounded-full border-4 ${currentRisk.border} animate-ping opacity-20`} />
                            </div>

                            {/* Details */}
                            <div className="flex-grow text-center md:text-left">
                                <h1 className={`text-4xl md:text-5xl font-bold ${currentRisk.text} mb-4 tracking-tight`}>
                                    {result.risk_level} Priority
                                </h1>
                                <p className="text-lg text-slate-600 font-medium mb-6 leading-relaxed">
                                    {currentRisk.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
                                    <div className="bg-white/60 rounded-xl p-3 border border-slate-200/50">
                                        <div className="text-xs text-slate-400 font-semibold uppercase">Confidence</div>
                                        <div className="text-lg font-bold text-slate-700">{result.confidence != null ? (result.confidence * 100).toFixed(0) : '--'}%</div>
                                    </div>
                                    <div className="bg-white/60 rounded-xl p-3 border border-slate-200/50">
                                        <div className="text-xs text-slate-400 font-semibold uppercase">Est. Wait</div>
                                        <div className="text-lg font-bold text-slate-700">
                                            {result.risk_level === 'High' || result.risk_level === 'CRITICAL' ? '0 min' : result.risk_level === 'Medium' ? '15 min' : '45 min'}
                                        </div>
                                    </div>
                                    <div className="bg-white/60 rounded-xl p-3 border border-slate-200/50 col-span-2">
                                        <div className="text-xs text-slate-400 font-semibold uppercase">Assigned Dept</div>
                                        <div className={`text-lg font-bold ${result.assigned_dept?.includes('BUSY') ? 'text-amber-600' : 'text-slate-700'}`}>
                                            {result.assigned_dept || "Assessment Pending"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Safety Advice Card */}
                    {result.safety_advice && (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 md:p-8 flex items-start gap-6 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-16 bg-white/40 rounded-full blur-2xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-indigo-900 mb-2">Immediate Safety Advice</h3>
                                <p className="text-indigo-800 text-lg leading-relaxed font-medium">
                                    "{result.safety_advice}"
                                </p>
                                <p className="text-indigo-600/70 text-sm mt-3">
                                    Please follow these instructions while waiting for the nurse.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Vitals Summary */}
                    {vitals && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 font-semibold uppercase">BP</div>
                                    <div className="text-lg font-bold text-slate-800">{vitals.bp || '--/--'}</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 font-semibold uppercase">Heart Rate</div>
                                    <div className="text-lg font-bold text-slate-800">{vitals.hr || '--'} bpm</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 font-semibold uppercase">Temp</div>
                                    <div className="text-lg font-bold text-slate-800">{vitals.temp || '--'} °F</div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <Link to="/intake" className="flex-1">
                            <button className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <ArrowRight className="w-5 h-5 rotate-180" />
                                New Assessment
                            </button>
                        </Link>
                        <button className="flex-1 py-4 bg-medical-blue-600 text-white font-semibold rounded-xl hover:bg-medical-blue-700 transition-all shadow-lg shadow-medical-blue-600/20 flex items-center justify-center gap-2">
                            <Printer className="w-5 h-5" />
                            Print Report
                        </button>
                        <button className="flex-1 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2">
                            <Share2 className="w-5 h-5" />
                            Send to Doctor
                        </button>
                    </div>

                </motion.div>
            </main>
        </div >
    );
}
