import { motion } from 'framer-motion';
import { ArrowRight, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GridBackground } from '../components/ui/GridBackground';
import { GlowingOrb } from '../components/ui/GlowingOrb';
import { Logo } from '../components/ui/Logo';

export function OTPVerification() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);

    // Simulate receiving OTP
    useEffect(() => {
        // Show simulated OTP in console or toast (for now console)
        setTimeout(() => {
            console.log("SIMULATED OTP: 2269");
        }, 1000);
    }, []);

    const handleChange = (element: any, index: number) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleVerify = () => {
        const enteredOtp = otp.join("");
        if (enteredOtp === "2269") {
            setIsVerifying(true);
            setTimeout(() => {
                navigate('/intake');
            }, 1000); // Fake delay
        } else {
            alert("Invalid OTP. Please enter 2269.");
            setOtp(['', '', '', '']);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 selection:bg-medical-blue-100 flex items-center justify-center p-6">

            {/* Background Elements */}
            <GridBackground />
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <GlowingOrb className="top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-200/30" delay={0} />
                <GlowingOrb className="bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-100/40" delay={2} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col p-8 text-center"
            >
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>

                <div className="mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-600/20">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Verify Your Identity</h2>
                    <p className="text-slate-500 text-sm mt-2">Enter the code sent to your mobile.</p>
                </div>

                <div className="flex justify-center gap-3 mb-8">
                    {otp.map((data, index) => (
                        <input
                            className="w-12 h-14 border border-slate-200 rounded-xl text-center text-xl font-bold text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all bg-white/80 shadow-sm"
                            type="text"
                            name="otp"
                            maxLength={1}
                            key={index}
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onKeyDown={e => {
                                if (e.key === "Backspace" && !otp[index] && index > 0) {
                                    // Move to previous input on backspace if current is empty
                                    // @ts-ignore
                                    e.currentTarget.previousSibling?.focus();
                                }
                            }}
                            onFocus={e => e.target.select()}
                        />
                    ))}
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                    >
                        {isVerifying ? (
                            <span className="flex items-center gap-2">Verifying...</span>
                        ) : (
                            <>
                                Verify & Continue
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </button>

                    <button
                        className="text-sm text-slate-400 font-medium hover:text-green-600 transition-colors"
                        onClick={() => console.log("Resending OTP... (2269)")}
                    >
                        Resend Code
                    </button>
                </div>

            </motion.div>

            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-8 z-20"
            >
                <Link to="/login">
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/70 backdrop-blur-md border border-white/50 text-slate-600 font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Back to Login
                    </motion.button>
                </Link>
            </motion.div>

        </div>
    );
}
