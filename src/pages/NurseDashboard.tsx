import { motion, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
    Users, Clock, AlertTriangle,
    Heart, Brain, Bone, ArrowRight, Bell
} from 'lucide-react';
import { GridBackground } from '../components/ui/GridBackground';

import { useEffect, useState } from 'react';
import { assessPatient, getRandomSymptoms, getRandomVitals, type TriagePrediction } from '../services/triageSdk';

export function NurseDashboard() {
    // State for Patients
    const [patients, setPatients] = useState<any[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);

    // Initial Load
    useEffect(() => {
        // Load some initial mock patients
        const loadInitial = async () => {
            const initialPatients = [
                { id: "P-001", risk: "CRITICAL", dept: "Cardiology", time: "10m", color: "red" },
                { id: "P-002", risk: "URGENT", dept: "Neurology", time: "15m", color: "amber" }
            ];
            setPatients(initialPatients);
        };
        loadInitial();
    }, []);

    // Staggered Entrance Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.4, 0.25, 1] as any
            }
        }
    };

    const handleSimulatePatient = async () => {
        setIsSimulating(true);
        const symptoms = getRandomSymptoms();
        const vitals = getRandomVitals();

        try {
            // Call SDK (Gemini or Mock)
            const prediction: TriagePrediction = await assessPatient(symptoms, vitals);

            const newPatient = {
                id: `P-${Math.floor(Math.random() * 1000)}`,
                risk: prediction.riskLevel,
                dept: prediction.recommendedDept,
                time: "Just now",
                color: prediction.riskLevel === 'CRITICAL' ? 'red' : prediction.riskLevel === 'URGENT' ? 'amber' : 'emerald'
            };

            setPatients(prev => [newPatient, ...prev]);

        } catch (error) {
            console.error("Simulation failed:", error);
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-medical-blue-100 flex flex-col overflow-hidden relative">
            <NoiseOverlay />
            <ScanningOverlay />
            <GridBackground />

            {/* Top Navigation */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-medical-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                    <span className="font-bold text-lg tracking-tight text-slate-800">MediVerse <span className="text-slate-400 font-normal">Hospitals</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-500 text-sm">
                        <Clock className="w-4 h-4 animate-[spin_10s_linear_infinite]" />
                        <span>Shift: 08:00 - 20:00</span>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-medical-blue-600 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden cursor-pointer">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nurse" alt="Profile" />
                    </div>
                </div>
            </motion.header>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-grow pt-24 px-6 pb-12 relative z-10 max-w-7xl mx-auto w-full"
            >

                {/* Welcome & Context */}
                <motion.div variants={itemVariants} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Hospital Operations Center</h1>
                        <p className="text-slate-500 mt-1">Real-time overview of active departments and patient flow.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSimulatePatient}
                            disabled={isSimulating}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {isSimulating ? "Simulating AI..." : "Simulate Incoming Patient"}
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative overflow-hidden px-4 py-2 bg-medical-blue-600 text-white rounded-lg text-sm font-medium hover:bg-medical-blue-700 transition-colors shadow-lg shadow-medical-blue-600/20 group cursor-pointer"
                        >
                            <span className="relative z-10">Manage Resources</span>
                            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Top Stats Row */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <TiltCard>
                        <StatsCardContent
                            title="Total Departments"
                            value={6}
                            icon={<BuildingIcon className="w-5 h-5 text-medical-blue-600" />}
                            trend="Active"
                            color="blue"
                        />
                    </TiltCard>
                    <TiltCard>
                        <StatsCardContent
                            title="Doctors Available"
                            value={12}
                            subtitle="Active Staff"
                            icon={<Users className="w-5 h-5 text-emerald-600" />}
                            trend="+2 from yesterday"
                            color="emerald"
                        />
                    </TiltCard>
                    <TiltCard>
                        <StatsCardContent
                            title="Avg Wait Time"
                            value={18}
                            suffix=" min"
                            icon={<Clock className="w-5 h-5 text-amber-600" />}
                            trend="-5% improvement"
                            color="amber"
                        />
                    </TiltCard>
                    <TiltCard>
                        <StatsCardContent
                            title="High Risk Patients"
                            value={patients.filter(p => p.risk === 'CRITICAL').length}
                            icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                            trend="Needs Attention"
                            color="red"
                            alert={patients.some(p => p.risk === 'CRITICAL')}
                        />
                    </TiltCard>
                </motion.div>

                {/* Middle Section: Grid & Queue */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Department Grid (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div variants={itemVariants} className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-slate-800">Department Status</h2>
                            <button className="text-medical-blue-600 text-sm font-medium hover:underline cursor-pointer">View All</button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-4">
                            <TiltCard>
                                <DepartmentCardContent
                                    name="Cardiology"
                                    icon={<Heart className="w-6 h-6 text-rose-500" />}
                                    status="available"
                                    stats={{ docs: 4, wait: "5 min" }}
                                />
                            </TiltCard>
                            <TiltCard>
                                <DepartmentCardContent
                                    name="Neurology"
                                    icon={<Brain className="w-6 h-6 text-violet-500" />}
                                    status="busy"
                                    stats={{ docs: 2, waiting: "15 min", avgWait: "30 min" }}
                                />
                            </TiltCard>
                            <TiltCard>
                                <DepartmentCardContent
                                    name="Orthopedics"
                                    icon={<Bone className="w-6 h-6 text-slate-500" />}
                                    status="critical"
                                    stats={{ docs: 2, waiting: "7 min", avgWait: "30 min" }}
                                />
                            </TiltCard>
                        </motion.div>
                    </div>

                    {/* Right Column: Live Risk Queue (1/3 width) */}
                    {/* ... (Keep Risk Queue as is, or wrap in Tilt if desired, keeping it simple for now) ... */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm h-full flex flex-col relative overflow-hidden">
                            {/* Scanning line for the queue specific */}
                            <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent top-0 animate-[scan-vertical_4s_linear_infinite]" />

                            <div className="p-5 border-b border-slate-100 flex justify-between items-center z-10 relative">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">Live Risk Queue</h2>
                                    <p className="text-xs text-slate-400">Sorted by priority rating</p>
                                </div>
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
                            </div>

                            {/* ... Content ... */}
                            <div className="p-4 space-y-3 flex-grow overflow-auto max-h-[500px] z-10 relative">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {patients.map((patient) => (
                                        <PatientCard
                                            key={patient.id}
                                            id={patient.id}
                                            risk={patient.risk}
                                            dept={patient.dept}
                                            time={patient.time}
                                            color={patient.color}
                                        />
                                    ))}
                                </AnimatePresence>
                                {patients.length === 0 && (
                                    <div className="text-center text-slate-400 py-8 text-sm">No active patients in queue.</div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl z-10 relative">
                                <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer">
                                    View Full Queue
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </div>

            </motion.main>
        </div >
    );
}

// --- New VFX Components ---

function NoiseOverlay() {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-[40] opacity-[0.03] mix-blend-overlay"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
        />
    );
}

function ScanningOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[30] overflow-hidden">
            <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-[scan_8s_linear_infinite]" />
        </div>
    );
}

function TiltCard({ children }: { children: React.ReactNode }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]); // Invert axis
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 100);
        y.set(yPct * 100);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    );
}

// Renamed for clarity - internal content of the tilt card
function StatsCardContent({ title, value, subtitle, icon, trend, color, alert, suffix = "" }: any) {
    const colors: any = {
        blue: "bg-medical-blue-50 border-medical-blue-100 text-medical-blue-600",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-600",
        amber: "bg-amber-50 border-amber-100 text-amber-600",
        red: "bg-red-50 border-red-100 text-red-600",
    };

    // Animated Counter
    const count = useMotionValue(0);
    const rounded = useSpring(count, { duration: 800 }); // 0.8s
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        count.set(value);
        const unsubscribe = rounded.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
        return () => unsubscribe();
    }, [value]);


    return (
        <div
            className={`p-5 rounded-2xl bg-white/60 backdrop-blur-sm border ${alert ? 'border-red-200 shadow-red-100 animate-[pulse_4s_ease-in-out_infinite]' : 'border-white/60'} shadow-sm transition-all duration-300 h-full`}
        >
            {/* Gloss reflection for Tilt */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2 rounded-xl ${colors[color]}`}>
                    {icon}
                </div>
                {alert && <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>}
            </div>
            <div className="relative z-10">
                <div className="text-slate-500 text-sm font-medium mb-1">{title}</div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {displayValue}{suffix}<span className="text-sm font-normal text-slate-400 ml-1">{subtitle}</span>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className={`text-xs mt-2 font-medium ${alert ? 'text-red-500' : 'text-slate-400'}`}
                >
                    {trend}
                </motion.div>
            </div>
        </div>
    );
}

function DepartmentCardContent({ name, icon, status, stats }: any) {
    const statusColors: any = {
        available: { dot: "bg-emerald-500", border: "border-slate-100", bg: "bg-white/60", ring: "bg-emerald-500/30" },
        busy: { dot: "bg-amber-500", border: "border-amber-100", bg: "bg-amber-50/30", ring: "bg-amber-500/30" },
        critical: { dot: "bg-red-500", border: "border-red-100", bg: "bg-red-50/30", ring: "bg-red-500/30" }
    };

    return (
        <div
            className={`group p-6 rounded-2xl backdrop-blur-sm border ${statusColors[status].border} ${statusColors[status].bg} shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 cursor-pointer h-full relative overflow-hidden`}
        >
            {/* Gloss reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite] pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-700">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        {name}
                        <div className="relative flex items-center justify-center">
                            <span className={`absolute inline-flex h-full w-full rounded-full ${statusColors[status].ring} animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColors[status].dot}`}></span>
                        </div>
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {stats.docs} Doctors</span>
                        {stats.waiting && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {stats.waiting} wait</span>}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
                <div className="flex-1 md:flex-none">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 group-hover:text-medical-blue-500 transition-colors">Avg Wait</div>
                    <div className="font-mono font-medium text-slate-700 bg-white/50 px-3 py-1 rounded-md border border-slate-200/50 group-hover:bg-cyan-50 group-hover:border-cyan-100 transition-colors">
                        {stats.avgWait || stats.wait || "--"}
                    </div>
                </div>
                <button className="p-2 group-hover:bg-white rounded-lg transition-all text-slate-400 group-hover:text-medical-blue-600 opacity-50 group-hover:opacity-100 transform group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ... PatientCard and BuildingIcon remain the same ...

function PatientCard({ id, risk, dept, time, color }: any) {
    const colors: any = {
        red: "bg-red-50 border-red-100 text-red-700",
        amber: "bg-amber-50 border-amber-100 text-amber-700",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-700"
    };

    const riskBadges: any = {
        CRITICAL: "bg-red-100 text-red-700 border-red-200 overflow-hidden relative",
        URGENT: "bg-amber-100 text-amber-700 border-amber-200",
        STABLE: "bg-emerald-100 text-emerald-700 border-emerald-200"
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${colors[color].split(' ')[1]} ${colors[color].split(' ')[0]} relative group transition-all hover:shadow-md cursor-pointer`}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color === 'red' ? 'bg-red-500 animate-[pulse_1s_ease-in-out_infinite]' : color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    <span className="font-mono font-bold text-slate-800">{id}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskBadges[risk]}`}>
                    <span className="relative z-10">{risk}</span>
                    {risk === 'CRITICAL' && (
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    )}
                </span>
            </div>

            <div className="space-y-1">
                <div className="text-xs text-slate-500">Rec. Dept: <span className="font-medium text-slate-700">{dept}</span></div>
                <div className="text-xs text-slate-500">Time since arrival: <span className="font-medium text-slate-700">{time}</span></div>
            </div>

            <button className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-lg shadow-sm text-slate-400 hover:text-medical-blue-600">
                <ArrowRight className="w-4 h-4" />
            </button>
        </motion.div>
    )
}

function BuildingIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    )
}

// --- Subcomponents ---



