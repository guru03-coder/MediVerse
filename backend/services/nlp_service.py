import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure API key from .env (never hardcode!)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

CONTROLLED_SYMPTOMS = [
    "chest pain",
    "breathlessness",
    "fever",
    "confusion",
    "headache",
    "nausea",
    "vomiting",
    "blurred vision",
    "dizziness",
    "sweating",
]

def extract_symptoms(user_text: str):
    prompt = f"""
    You are a medical AI assistant. Your task is to extract standardized symptoms from patient descriptions.
    
    1. Analyze the "Patient description" below.
    2. Map any mentioned symptoms to the closest match in the "Allowed Symptom List".
       - Example: "tightness in chest" -> "chest pain"
       - Example: "hurt head" -> "headache"
       - Example: "faint" -> "dizziness"
       - Example: "tummy ache" -> "stomach pain" (if in list, otherwise ignore)
    3. If a described symptom is NOT in the allowed list and cannot be mapped to one, IGNORE IT.
    4. Return ONLY a Python list of strings containing the matched standardized symptoms.

    Allowed Symptom List:
    {CONTROLLED_SYMPTOMS}

    Patient description:
    "{user_text}"
    """

    try:
        response = model.generate_content(prompt)
        # Clean up potential markdown formatting in response (e.g. ```python ... ```)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            if text.endswith("```"):
                text = text.rsplit("\n", 1)[0]
        
        extracted = eval(text.strip())
        return extracted
    except Exception:
        # Fallback: never let API failure crash prediction
        return []
