from fastapi import APIRouter, UploadFile, File
import requests
import re
import os
from dotenv import load_dotenv
load_dotenv()
router = APIRouter()

OCR_API_KEY = os.getenv("OCR_SPACE_API_KEY")

@router.post("/ocr")
async def extract_number_plate(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()

        response = requests.post(
            "https://api.ocr.space/parse/image",
            files={"file": ("image.jpg", file_bytes)},
            data={
                "apikey": OCR_API_KEY,
                "language": "eng"
            }
        )

        result = response.json()
        print("OCR RESPONSE:", result)

        if result.get("IsErroredOnProcessing"):
            return {
                "vehicle_number": "",
                "error": result.get("ErrorMessage")
            }

        text = ""

        if result.get("ParsedResults"):
            text = result["ParsedResults"][0]["ParsedText"]

        cleaned = re.sub(r'[^A-Z0-9]', '', text.upper())

        return {"vehicle_number": cleaned}

    except Exception as e:
        print("OCR Exception:", e)
        return {"vehicle_number": ""}
    
    # ocr.py using easyocr 
# from fastapi import APIRouter, UploadFile, File
# import easyocr, shutil, os, cv2

# router = APIRouter()
# reader = easyocr.Reader(['en'], gpu=False)

# @router.post("/ocr")
# async def extract_number_plate(file: UploadFile = File(...)):
#     file_location = f"temp_{file.filename}"

#     with open(file_location, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     img = cv2.imread(file_location)
#     if img is None:
#         os.remove(file_location)
#         return {"vehicle_number": ""}

#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     gray = cv2.GaussianBlur(gray, (5, 5), 0)

#     results = reader.readtext(
#         gray,
#         detail=1,
#         paragraph=False,
#         allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
#     )

#     os.remove(file_location)

#     text = "".join(t for _, t, p in results if p > 0.3)
#     return {"vehicle_number": text}