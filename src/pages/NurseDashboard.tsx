import { useNavigate } from 'react-router-dom';
import {
    Users, Clock, AlertTriangle, Activity,
    Heart, Brain, Bone, Bell, LogOut, X, BarChart3, CheckCircle
} from 'lucide-react';
import { GridBackground } from '../components/ui/GridBackground';
import { Logo } from '../components/ui/Logo';
import { MockDB } from '../lib/mockDatabase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

// --- Types ---
interface AnalyticsData {
    risk_distribution: { name: string; value: number }[];
    department_load: { name: string; value: number }[];
    patient_attendance: { name: string; value: number }[];
    model_accuracy: { name: string; value: number }[];
}

const generateTrendData = () => {
    const data = [];
    const now = new Date();
    for (let i = 12; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60000); // 5 min intervals
        data.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: Math.floor(Math.random() * 5) + (i % 3 === 0 ? 2 : 0)
        });
    }
    return data;
};

const generateFlowData = () => {
    const data = [];
    const now = new Date();
    // Generate for last 8 hours
    for (let i = 8; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60000); // Hourly
        data.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            arrivals: Math.floor(Math.random() * 8) + 2,
            discharges: Math.floor(Math.random() * 6) + 1
        });
    }
    return data;
};

export function NurseDashboard() {
    const navigate = useNavigate();

    // State
    const [stats, setStats] = useState<any>(null);
    const [patients, setPatients] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [trendData, setTrendData] = useState<any[]>(generateTrendData());
    const [flowData, setFlowData] = useState<any[]>(generateFlowData());
    const [viewMode, setViewMode] = useState<'queue' | 'analytics'>('queue');
    const [showDoctorModal, setShowDoctorModal] = useState(false);

    // AI & Action State


    // --- Actions ---
    const handleDischarge = async (id: string, code: string) => {
        if (!confirm("Mark patient " + code + " as discharged?")) return;

        try {
            await fetch("/patients/" + id + "/discharge", { method: 'POST' });
            // Optimistic update
            setPatients(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            console.warn("Backend discharge failed, using mock DB", e);
            // Fallback to Mock DB
            const success = MockDB.dischargePatient(id);
            if (success) {
                setPatients(prev => prev.filter(p => p.id !== id));
            } else {
                alert("Failed to discharge");
            }
        }
    };


    // --- Polling ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Stats (Always fetch)
                const statsRes = await fetch('/dashboard/stats');
                const statsData = await statsRes.json();
                setStats(statsData);

                // 2. Poll based on view
                if (viewMode === 'queue') {
                    const patientsRes = await fetch('/patients');
                    const patientsData = await patientsRes.json();
                    setPatients(patientsData);
                } else {
                    const analyticsRes = await fetch('/dashboard/analytics');
                    const analyticsData = await analyticsRes.json();
                    setAnalytics(analyticsData);
                }
            } catch (error) {
                console.error("Polling Error:", error);

                // Fallback to MockDB (Dynamic) instead of static mocks
                if (!stats) setStats(MockDB.getStats());
                if (patients.length === 0) setPatients(MockDB.getPatients());
                if (!analytics) setAnalytics(MockDB.getAnalytics());
            }
        };

        // Initial loading 
        if (!stats) setStats(MockDB.getStats());
        if (patients.length === 0) setPatients(MockDB.getPatients());
        if (!analytics) setAnalytics(MockDB.getAnalytics());

        // Trend Update Logic
        const trendInterval = setInterval(() => {
            setTrendData(prev => {
                const newData = [...prev.slice(1)];
                const now = new Date();
                newData.push({
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    value: Math.floor(Math.random() * 6) + 1 // New random point
                });
                return newData;
            });
        }, 5000); // Fast update for demo (5s)

        fetchData(); // Initial
        const interval = setInterval(fetchData, 5000); // Poll every 5s

        return () => {
            clearInterval(interval);
            clearInterval(trendInterval);
        }
    }, [viewMode]);

    // Staggered Entrance Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const getDeptIcon = (name: string) => {
        if (name.includes("Cardio")) return <Heart className="w-6 h-6 text-rose-500" />;
        if (name.includes("Neuro")) return <Brain className="w-6 h-6 text-indigo-500" />;
        if (name.includes("Ortho")) return <Bone className="w-6 h-6 text-slate-500" />;
        return <Activity className="w-6 h-6 text-medical-blue-500" />;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-hidden selection:bg-medical-blue-100">
            <GridBackground />
            <NoiseOverlay />
            <ScanningOverlay />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-md border-b border-white/50 z-50 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-2">
                    <Logo />
                    <span className="ml-4 px-2 py-0.5 rounded-full bg-medical-blue-50 text-medical-blue-600 text-[10px] font-bold uppercase tracking-wider border border-medical-blue-100">
                        NurseOS v2.0
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Online
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date().toLocaleTimeString()}
                        </span>
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

                    <div className="flex items-center gap-3 pl-2">
                        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors group"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="pt-24 pb-12 px-6 max-w-7xl mx-auto relative z-10"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                            Live Dashboard
                        </h1>
                        <p className="text-slate-500 mt-1">Real-time patient flow & resource monitoring</p>
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowDoctorModal(true)}
                            className="relative overflow-hidden px-4 py-2 bg-medical-blue-600 text-white rounded-lg text-sm font-medium hover:bg-medical-blue-700 transition-colors shadow-lg shadow-medical-blue-600/20 group cursor-pointer"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Manage Resources
                            </span>
                        </motion.button>
                    </div>
                </div>

                {/* KPI Cards */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    <TiltCard>
                        <StatsCardContent
                            title="Total Departments"
                            value={stats?.departments ? Object.keys(stats.departments).length : 0}
                            icon={<Activity className="w-5 h-5 text-medical-blue-600" />}
                            trend="Active"
                            color="blue"
                        />
                    </TiltCard>
                    <TiltCard>
                        <StatsCardContent
                            title="Doctors Active"
                            value={stats?.departments ? Object.values(stats.departments).reduce((acc: any, d: any) => acc + d.active_doctors, 0) : 0}
                            subtitle="On Shift"
                            icon={<Users className="w-5 h-5 text-emerald-600" />}
                            trend="Real-time"
                            color="emerald"
                        />
                    </TiltCard>
                    <TiltCard>
                        <StatsCardContent
                            title="Avg Wait Time"
                            value={stats?.departments ? Math.round(
                                Object.values(stats.departments).reduce((acc: any, d: any) => acc + (d.wait_time || 0), 0) /
                                (Object.values(stats.departments).length || 1)
                            ) : 0}
                            suffix=" min"
                            icon={<Clock className="w-5 h-5 text-amber-600" />}
                            trend="Dynamic"
                            color="amber"
                        />
                    </TiltCard>
                    <TiltCard>
                        <StatsCardContent
                            title="High Risk Waiting"
                            value={stats?.queue?.high_risk_waiting || 0}
                            icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                            trend="Needs Attention"
                            color="red"
                            alert={stats?.queue?.high_risk_waiting > 0}
                        />
                    </TiltCard>
                </motion.div>

                {/* --- Main Content Area --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                    {/* Left Col: Queue OR Analytics */}
                    <div className="lg:col-span-2 space-y-6">

                        <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setViewMode('queue')}
                                    className={`text-lg font-bold transition-colors flex items-center gap-2 ${viewMode === 'queue' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Users className="w-4 h-4" /> Live Queue
                                </button>
                                <button
                                    onClick={() => setViewMode('analytics')}
                                    className={`text-lg font-bold transition-colors flex items-center gap-2 ${viewMode === 'analytics' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <BarChart3 className="w-4 h-4" /> Analytics
                                </button>
                            </div>
                            {viewMode === 'queue' && (
                                <button onClick={() => setShowDoctorModal(true)} className="text-medical-blue-600 text-sm font-medium hover:underline cursor-pointer">Manage All</button>
                            )}
                        </div>

                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-1 min-h-[500px]">
                            <AnimatePresence mode='wait'>
                                {viewMode === 'queue' ? (
                                    <motion.div
                                        key="queue"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4 p-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {stats?.departments && Object.entries(stats.departments).map(([name, data]: [string, any]) => (
                                                <TiltCard key={name}>
                                                    <DepartmentCardContent
                                                        name={name}
                                                        icon={getDeptIcon(name)}
                                                        status={data.active_doctors > 0 ? "available" : "busy"}
                                                        stats={{
                                                            docs: data.active_doctors,
                                                            wait: data.wait_time ? `${data.wait_time} min` : (data.active_doctors === 0 ? "Closed" : "--")
                                                        }}
                                                        onToggle={() => setShowDoctorModal(true)}
                                                    />
                                                </TiltCard>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="analytics"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="p-6 space-y-8"
                                    >
                                        {/* Risk Distribution Chart */}
                                        <div>
                                            <h3 className="text-slate-600 font-medium mb-4 flex items-center gap-2">
                                                <Activity className="w-4 h-4" /> Risk Distribution
                                            </h3>
                                            <div className="flex items-end gap-2 h-40 border-b border-slate-200 pb-2 px-4">
                                                {analytics?.risk_distribution && analytics.risk_distribution.length > 0 ? (
                                                    analytics.risk_distribution.map((item, i) => {
                                                        const maxVal = Math.max(...analytics.risk_distribution.map(d => d.value), 1);
                                                        const height = (item.value / maxVal) * 100;
                                                        const color = item.name === 'CRITICAL' ? 'bg-red-500' : item.name === 'High' ? 'bg-amber-500' : 'bg-emerald-500';

                                                        return (
                                                            <div key={item.name} className="flex-1 flex flex-col justify-end items-center group">
                                                                <motion.div
                                                                    initial={{ height: 0 }}
                                                                    animate={{ height: `${height}%` }}
                                                                    className={`w-full max-w-[40px] ${color} rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity`}
                                                                />
                                                                <span className="text-[10px] text-slate-500 mt-2 font-medium truncate w-full text-center">{item.name}</span>
                                                                <span className="text-xs font-bold text-slate-700">{item.value}</span>
                                                            </div>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No Data</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Department Load Chart */}
                                        <div>
                                            <h3 className="text-slate-600 font-medium mb-4 flex items-center gap-2">
                                                <Users className="w-4 h-4" /> Department Load
                                            </h3>
                                            <div className="space-y-3">
                                                {analytics?.department_load && analytics.department_load.length > 0 ? (
                                                    analytics.department_load.map((item, i) => (
                                                        <div key={item.name} className="space-y-1">
                                                            <div className="flex justify-between text-xs">
                                                                <span className="font-medium text-slate-700">{item.name}</span>
                                                                <span className="text-slate-500">{item.value} patients</span>
                                                            </div>
                                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${(item.value / (Math.max(...analytics.department_load.map(d => d.value), 1))) * 100}%` }}
                                                                    className="h-full bg-medical-blue-500 rounded-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center text-slate-400 text-sm py-8">No Data</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Patient Flow Chart (Arrivals vs Discharges) */}
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-slate-600 font-medium flex items-center gap-2">
                                                    <Clock className="w-4 h-4" /> Patient Flow (Hourly)
                                                </h3>
                                                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    Real-time patient flow monitoring
                                                </span>
                                            </div>

                                            <div className="h-40 w-full bg-slate-50/50 rounded-lg border border-slate-100 p-2 relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={flowData}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis
                                                            dataKey="time"
                                                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                                                            axisLine={false}
                                                            tickLine={false}
                                                            interval={1}
                                                        />
                                                        <YAxis
                                                            hide
                                                            domain={[0, 'auto']}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                            labelStyle={{ color: '#64748b', fontSize: '10px' }}
                                                        />
                                                        <Line
                                                            name="Arrivals"
                                                            type="monotone"
                                                            dataKey="arrivals"
                                                            stroke="#10b981" // Green
                                                            strokeWidth={2}
                                                            dot={false}
                                                            activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                                                        />
                                                        <Line
                                                            name="Discharges"
                                                            type="monotone"
                                                            dataKey="discharges"
                                                            stroke="#3b82f6" // Blue
                                                            strokeWidth={2}
                                                            dot={false}
                                                            activeDot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="flex justify-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                    <span className="text-[10px] text-slate-500">Arrivals</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                    <span className="text-[10px] text-slate-500">Discharges</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Live Risk Trend Chart */}
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-slate-600 font-medium flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-red-500" /> Live Risk Trend (Last 60m)
                                                </h3>
                                                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full border border-red-100 animate-pulse">
                                                    Real-time risk spike detection enabled by ML model
                                                </span>
                                            </div>

                                            <div className="h-40 w-full bg-slate-50/50 rounded-lg border border-slate-100 p-2 relative">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={trendData}>
                                                        <defs>
                                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                        <XAxis
                                                            dataKey="time"
                                                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                                                            axisLine={false}
                                                            tickLine={false}
                                                            interval={2}
                                                        />
                                                        <YAxis
                                                            hide
                                                            domain={[0, 10]}
                                                        />
                                                        <Tooltip
                                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                            itemStyle={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}
                                                            labelStyle={{ color: '#64748b', fontSize: '10px' }}
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="value"
                                                            stroke="#ef4444"
                                                            strokeWidth={2}
                                                            dot={false}
                                                            activeDot={{ r: 4, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                                                            animationDuration={1500}
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>

                    {/* Right Column: Live Risk Queue (1/3 width) */}
                    <div className="lg:col-span-1">
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

                            {/* Queue List */}
                            <div className="p-4 space-y-3 flex-grow overflow-auto max-h-[500px] z-10 relative">
                                <AnimatePresence initial={false} mode="popLayout">
                                    {patients.map((patient) => (
                                        <PatientCard
                                            key={patient.id}
                                            data={patient}
                                            time={`${Math.floor((Date.now() - new Date(patient.created_at).getTime()) / 60000)} min`}
                                            onDischarge={() => handleDischarge(patient.id, patient.patient_code)}
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
                    </div>

                </div>

            </motion.main>

            <ManageDoctorsModal
                isOpen={showDoctorModal}
                onClose={() => setShowDoctorModal(false)}
                departments={stats?.departments}
            />


        </div>
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

// Renamed for clarity - internal content of the tilt card
function DepartmentCardContent({ name, icon, status, stats, onToggle }: any) {
    const isAvailable = status === "available";

    return (
        <div className={`p-4 md:p-5 rounded-2xl bg-white/60 backdrop-blur-sm border ${isAvailable ? 'border-white/60' : 'border-slate-200 bg-slate-50/80'} shadow-sm transition-all duration-300 group hover:shadow-md h-full flex items-center justify-between`}>

            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isAvailable ? 'bg-white shadow-sm' : 'bg-slate-200 opacity-50'}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-base font-bold text-slate-800">{name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-[pulse_3s_infinite]' : 'bg-slate-400'}`}></span>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isAvailable ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {isAvailable ? "Active" : "Unavailable"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isAvailable && (
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-slate-400 font-medium uppercase">Est. Wait</div>
                        <div className="font-mono text-sm font-bold text-slate-700">{stats.wait || stats.waiting || "--"}</div>
                    </div>
                )}

                <button
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue-500 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                    <span
                        className={`block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isAvailable ? 'translate-x-7' : 'translate-x-1'}`}
                    />
                </button>
            </div>
        </div>
    );
}

// ... PatientCard and BuildingIcon remain the same ...

function PatientCard({ data, time, onDischarge }: any) {
    const { patient_code: id, risk_level: risk, assigned_department: dept } = data;

    const color = risk === 'CRITICAL' ? 'red' : risk === 'High' ? 'amber' : 'emerald';

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
            className={`p-4 rounded-xl border ${colors[color].split(' ')[1]} ${colors[color].split(' ')[0]} relative group transition-all hover:shadow-md`}
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

            <div className="space-y-1 mb-3">
                <div className="text-xs text-slate-500">Rec. Dept: <span className="font-medium text-slate-700">{dept}</span></div>
                <div className="text-xs text-slate-500">Time since arrival: <span className="font-medium text-slate-700">{time}</span></div>
            </div>

            <div className="flex gap-2 opacity-100">
                <button
                    onClick={(e) => { e.stopPropagation(); onDischarge(); }}
                    className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center gap-1"
                >
                    <CheckCircle className="w-3 h-3" /> Discharge
                </button>
            </div>
        </motion.div>
    )
}


// --- Subcomponents ---

function ManageDoctorsModal({ isOpen, onClose, departments }: any) {
    const [selectedDept, setSelectedDept] = useState<string>("");
    const [newDocName, setNewDocName] = useState("");

    // Auto-select first dept
    useEffect(() => {
        if (departments && Object.keys(departments).length > 0 && !selectedDept) {
            setSelectedDept(Object.keys(departments)[0]);
        }
    }, [departments]);

    const handleAddDoctor = async () => {
        if (!selectedDept || !newDocName) return;

        // Find dept ID
        const deptData = departments[selectedDept];
        if (!deptData) return;

        try {
            const res = await fetch('/doctor/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newDocName, department_id: deptData.id })
            });
            if (!res.ok) throw new Error("API Failed");

            setNewDocName("");
            alert("Doctor Added! They are INACTIVE by default.");
            onClose();

        } catch (e) {
            console.warn("Backend add doctor failed, using mock DB", e);
            // Fallback
            const success = MockDB.addDoctor(selectedDept, newDocName);
            if (success) {
                setNewDocName("");
                alert("Doctor Added (Mock DB)!");
                onClose();
            } else {
                alert("Failed to add doctor");
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Manage Resources</h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                <select
                                    value={selectedDept}
                                    onChange={(e) => setSelectedDept(e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-blue-500 outline-none"
                                >
                                    {departments && Object.keys(departments).map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Add New Doctor</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newDocName}
                                        onChange={(e) => setNewDocName(e.target.value)}
                                        placeholder="Dr. Name"
                                        className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-blue-500 outline-none"
                                    />
                                    <button
                                        onClick={handleAddDoctor}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-500">
                                <p>Doctors must be manually activated to start accepting patients.</p>
                                <p className="mt-2 text-xs text-slate-400">Current Active: {
                                    selectedDept && departments[selectedDept] ? departments[selectedDept].active_doctors : 0
                                }</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
