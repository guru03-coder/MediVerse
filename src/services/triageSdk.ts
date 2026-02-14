import { GoogleGenerativeAI } from "@google/generative-ai";

export interface TriagePrediction {
    riskLevel: 'CRITICAL' | 'URGENT' | 'STABLE';
    confidence: number;
    recommendedDept: 'Cardiology' | 'Neurology' | 'Orthopedics' | 'General' | 'Pediatrics';
    reasoning: string;
}

// Initialize Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Mock data generator for fallback
const MOCK_SYMPTOMS = [
    "Chest pain radiating to left arm",
    "Severe headache with vision loss",
    "Fractured tibia, bone visible",
    "High fever and persistent cough",
    "Mild abdominal pain",
    "Dizziness and nausea"
];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export async function assessPatient(symptoms: string, vitals: any): Promise<TriagePrediction> {

    // 1. Try Gemini Simulation (if key exists)
    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
                Act as an expert triage nurse system. 
                Analyze these symptoms: "${symptoms}" and vitals: ${JSON.stringify(vitals)}.
                Return a JSON object ONLY with the following structure (no markdown, no backticks):
                {
                    "riskLevel": "CRITICAL" | "URGENT" | "STABLE",
                    "confidence": number (0-100),
                    "recommendedDept": "Cardiology" | "Neurology" | "Orthopedics" | "General" | "Pediatrics",
                    "reasoning": "Short clinical explanation (max 10 words)"
                }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

            return JSON.parse(text) as TriagePrediction;

        } catch (error) {
            console.warn("Gemini simulation failed, falling back to mock rules.", error);
        }
    }

    // 2. Fallback Mock Logic (Rule-based)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000)); // Fake latency

    const lowerSymptoms = symptoms.toLowerCase();

    if (lowerSymptoms.includes('chest') || lowerSymptoms.includes('heart')) {
        return {
            riskLevel: 'CRITICAL',
            confidence: 95,
            recommendedDept: 'Cardiology',
            reasoning: "Potential acute coronary syndrome suspected."
        };
    }

    if (lowerSymptoms.includes('head') || lowerSymptoms.includes('vision') || lowerSymptoms.includes('stroke')) {
        return {
            riskLevel: 'CRITICAL',
            confidence: 92,
            recommendedDept: 'Neurology',
            reasoning: "Neurological deficit, rule out CVA."
        };
    }

    if (lowerSymptoms.includes('bone') || lowerSymptoms.includes('fracture') || lowerSymptoms.includes('leg') || lowerSymptoms.includes('arm')) {
        return {
            riskLevel: 'URGENT',
            confidence: 88,
            recommendedDept: 'Orthopedics',
            reasoning: "Trauma detected, imaging required."
        };
    }

    return {
        riskLevel: 'STABLE',
        confidence: 75,
        recommendedDept: 'General',
        reasoning: "Vitals stable, routine monitoring."
    };
}

export function getRandomSymptoms(): string {
    return getRandomItem(MOCK_SYMPTOMS);
}

export function getRandomVitals() {
    return {
        hr: 60 + Math.floor(Math.random() * 60),
        bp: `${90 + Math.floor(Math.random() * 50)}/${60 + Math.floor(Math.random() * 30)}`,
        spo2: 90 + Math.floor(Math.random() * 10),
        temp: 36.5 + Math.random() * 2.5
    };
}
