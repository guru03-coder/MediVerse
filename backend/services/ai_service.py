import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load env vars from root .env
# Assuming .env is one level up from backend or in root
# Resolve .env path relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # backend/services
ROOT_DIR = os.path.dirname(os.path.dirname(BASE_DIR)) # triagex
load_dotenv(dotenv_path=os.path.join(ROOT_DIR, ".env")) 

API_KEY = os.getenv("VITE_GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("WARNING: VITE_GEMINI_API_KEY not found in environment.")

def generate_medical_insight(patient_data: dict) -> str:
    """
    Generates a concise medical insight using Gemini.
    """
    if not API_KEY:
        return "AI Service Unavailable: Missing API Key."

    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""
        Act as an expert triage nurse assistant. Analyze this patient case:
        
        - Symptoms: {patient_data.get('Symptoms', 'N/A')}
        - Vitals: {patient_data.get('Vitals', 'N/A')}
        - Age/Gender: {patient_data.get('Age', 'N/A')} / {patient_data.get('Gender', 'N/A')}
        - Assigned Risk: {patient_data.get('risk_level', 'Unknown')}
        
        Provide a concise response (max 3 bullet points) with:
        1. Potential Differential Diagnosis (Top 2)
        2. Recommended Immediate Nursing Action
        3. Justification for the Risk Level
        
        Format as clear Markdown.
        """
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"GenAI Error: {e}")
        return "AI Analysis failed due to an error."
