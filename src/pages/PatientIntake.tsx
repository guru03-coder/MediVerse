import { motion } from 'framer-motion';
import {
    User, Heart, Thermometer, Activity,
    Mic, Send, Hash, Calendar, FileText, Siren
} from 'lucide-react';
import { GridBackground } from '../components/ui/GridBackground';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

export function PatientIntake() {
    const [patientId, setPatientId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [preExisting, setPreExisting] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [temperature, setTemperature] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleVoiceInput = () => {
        setIsListening(!isListening);
        // Voice input placeholder — Gemini integration
        if (!isListening) {
            setTimeout(() => {
                setSymptoms(prev => prev + (prev ? ', ' : '') + 'chest pain, shortness of breath');
                setIsListening(false);
            }, 2000);
        }
    };

    const handleSOS = () => {
        const sosResult = {
            risk_level: 'CRITICAL',
            sos: true,
        };
        navigate('/triage-result', {
            state: {
                result: sosResult,
                patientId: patientId || 'EMERGENCY',
                patientName: patientName || 'Unknown',
                vitals: { bp: bloodPressure, hr: heartRate, temp: temperature }
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Patient_ID: patientId,
                    Name: patientName,
                    Age: parseInt(age),
                    'Blood Pressure': bloodPressure,
                    'Heart Rate': parseInt(heartRate),
                    Temperature: parseFloat(temperature),
                    Gender: gender,
                    Symptoms: symptoms,
                }),
            });
            const data = await response.json();
            navigate('/triage-result', {
                state: {
                    result: data,
                    patientId,
                    patientName,
                    vitals: { bp: bloodPressure, hr: heartRate, temp: temperature }
                }
            });
        } catch (error) {
            console.error('Prediction failed:', error);
            const errorResult = { risk_level: 'ERROR', error: 'Could not connect to prediction service' };
            navigate('/triage-result', {
                state: {
                    result: errorResult,
                    patientId,
                    patientName,
                    vitals: { bp: bloodPressure, hr: heartRate, temp: temperature }
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as any } },
    };



    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-medical-blue-100 flex flex-col overflow-hidden relative">
            {/* Background */}
            <GridBackground />
            <div className="fixed inset-0 pointer-events-none z-[30] overflow-hidden">
                <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-[scan_8s_linear_infinite]" />
            </div>

            {/* Top Navigation */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-500 text-sm">
                        <User className="w-4 h-4" />
                        Nurse Panel
                    </span>
                    <Link to="/dashboard/nurse">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">
                            ← Back to Dashboard
                        </button>
                    </Link>
                </div>
            </motion.header>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-grow pt-24 px-6 pb-12 relative z-10 max-w-5xl mx-auto w-full"
            >
                {/* Page Title */}
                <motion.div variants={itemVariants} className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-blue-50 text-medical-blue-600 text-xs font-medium mb-3 border border-medical-blue-100">
                        <User className="w-3 h-3" />
                        Patient Intake
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Core Patient Data</h1>
                    <p className="text-slate-500 mt-1">Capture patient information for AI-powered triage assessment.</p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column: Patient Info + Symptoms */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Section: Core Patient Data */}
                            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                                        <User className="w-4 h-4 text-medical-blue-500" />
                                        Patient Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Patient ID */}
                                        <div className="relative group">
                                            <Hash className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-medical-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Patient ID"
                                                value={patientId}
                                                onChange={(e) => setPatientId(e.target.value)}
                                                required
                                                className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-medical-blue-500 focus:ring-1 focus:ring-medical-blue-500 transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        {/* Patient Name */}
                                        <div className="relative group">
                                            <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-medical-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Patient Name"
                                                value={patientName}
                                                onChange={(e) => setPatientName(e.target.value)}
                                                required
                                                className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-medical-blue-500 focus:ring-1 focus:ring-medical-blue-500 transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        {/* Age */}
                                        <div className="relative group">
                                            <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-medical-blue-500 transition-colors" />
                                            <input
                                                type="number"
                                                placeholder="Age"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                required
                                                min="1"
                                                max="120"
                                                className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-medical-blue-500 focus:ring-1 focus:ring-medical-blue-500 transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div className="relative group">
                                            <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-medical-blue-500 transition-colors" />
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                required
                                                className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-medical-blue-500 focus:ring-1 focus:ring-medical-blue-500 transition-all appearance-none cursor-pointer text-sm"
                                            >
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                            <div className="absolute right-3 top-4 pointer-events-none">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>

                                        {/* Pre-Existing Conditions */}
                                        <div className="relative group">
                                            <FileText className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-medical-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Pre-Existing Conditions"
                                                value={preExisting}
                                                onChange={(e) => setPreExisting(e.target.value)}
                                                className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-medical-blue-500 focus:ring-1 focus:ring-medical-blue-500 transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Section: Symptoms */}
                            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-medical-blue-500 rounded-full" />
                                        Section 1 — Symptoms
                                    </h2>

                                    <div className="flex gap-3">
                                        <div className="flex-1 relative">
                                            <textarea
                                                placeholder="Describe symptoms (e.g. chest pain, difficulty breathing, fever...)"
                                                value={symptoms}
                                                onChange={(e) => setSymptoms(e.target.value)}
                                                required
                                                rows={4}
                                                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-medical-blue-500 focus:ring-1 focus:ring-medical-blue-500 transition-all placeholder:text-slate-400 resize-none"
                                            />
                                        </div>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleVoiceInput}
                                            className={`flex flex-col items-center justify-center gap-2 px-5 rounded-xl border transition-all cursor-pointer ${isListening
                                                ? 'bg-red-50 border-red-200 text-red-600'
                                                : 'bg-white/80 border-slate-200 text-slate-500 hover:border-medical-blue-300 hover:text-medical-blue-600'
                                                }`}
                                        >
                                            <Mic className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
                                            <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">
                                                {isListening ? 'Listening...' : 'Voice Input'}
                                            </span>

                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Section: Vitals */}
                            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                                        Section 2 — Vitals
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Blood Pressure */}
                                        <div className="relative group">
                                            <Activity className="absolute left-3 top-3.5 w-5 h-5 text-rose-400 group-focus-within:text-rose-600 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Blood Pressure (e.g. 120/80)"
                                                value={bloodPressure}
                                                onChange={(e) => setBloodPressure(e.target.value)}
                                                required
                                                pattern="\d{2,3}\/\d{2,3}"
                                                className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        {/* Heart Rate */}
                                        <div className="relative group">
                                            <Heart className="absolute left-3 top-3.5 w-5 h-5 text-red-400 group-focus-within:text-red-600 transition-colors" />
                                            <input
                                                type="number"
                                                placeholder="Heart Rate (bpm)"
                                                value={heartRate}
                                                onChange={(e) => setHeartRate(e.target.value)}
                                                required
                                                min="30"
                                                max="250"
                                                className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all placeholder:text-slate-400"
                                            />
                                        </div>

                                        {/* Temperature */}
                                        <div className="relative group md:col-span-2">
                                            <Thermometer className="absolute left-3 top-3.5 w-5 h-5 text-amber-400 group-focus-within:text-amber-600 transition-colors" />
                                            <input
                                                type="number"
                                                placeholder="Temperature (°F)"
                                                value={temperature}
                                                onChange={(e) => setTemperature(e.target.value)}
                                                required
                                                min="90"
                                                max="110"
                                                step="0.1"
                                                className="w-full bg-white/80 border border-slate-200 rounded-xl px-10 py-3 text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div variants={itemVariants}>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full relative overflow-hidden bg-medical-blue-600 hover:bg-medical-blue-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-medical-blue-600/20 flex items-center justify-center gap-3 group cursor-pointer disabled:opacity-60"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing Intake...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                SUBMIT INTAKE
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                </motion.button>
                            </motion.div>
                        </div>

                        {/* Right Column: SOS + Result */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* SOS Emergency Button */}
                            <motion.div variants={itemVariants}>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSOS}
                                    className="w-full bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 rounded-2xl p-6 flex flex-col items-center gap-3 transition-all group cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 via-transparent to-transparent pointer-events-none" />
                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-red-100 group-hover:bg-red-200 rounded-full flex items-center justify-center transition-colors">
                                            <Siren className="w-8 h-8 text-red-600 group-hover:animate-pulse" />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-red-700 tracking-wider">SOS EMERGENCY</div>
                                            <div className="text-xs text-red-500 mt-1">Immediate triage override</div>
                                        </div>
                                    </div>
                                </motion.button>
                            </motion.div>

                            {/* Result Card has been moved to a new page */}
                        </div>
                    </div>
                </form>
            </motion.main>
        </div>
    );
}
