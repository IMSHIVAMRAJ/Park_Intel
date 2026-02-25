# main.py
from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

from ocr import router as ocr_router   # 👈 OCR import

load_dotenv()

app = FastAPI()

# 🔥 OCR route attach
app.include_router(ocr_router)

# ---------- Gemini Predict (SAME AS BEFORE) ----------

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash-lite")

class PredictionRequest(BaseModel):
    totalSlots: int
    averageAvailable: float
    percentage: float
    day: str
    hour: int

@app.post("/predict")
async def predict(data: PredictionRequest):
    prompt = f"""
You are a parking app assistant.

Your job is to respond ONLY in plain text sentences.
Do NOT use bullets, stars, headings, markdown, numbers, percentages or calculations.

STRICT RULES:
- Output must be exactly 3 short sentences
- Do NOT show any numbers or percentages
- Do NOT mention capacity, slots, averages or data
- Do NOT explain calculations
- Do NOT ask questions
-DO NOT SHOW What this information could be used for
- Do NOT use symbols like *, -, %, :
- Use words like: low availability, moderate availability, high availability
- Give simple advice like arrive earlier or try later hours

Context (DO NOT repeat this data):
Day: {data.day}
Time: {data.hour}:00
"""

    response = model.generate_content(prompt)
    return {"analysis": response.text}