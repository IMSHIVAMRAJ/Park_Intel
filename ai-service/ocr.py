# ocr.py
from fastapi import APIRouter, UploadFile, File
import easyocr, shutil, os, cv2

router = APIRouter()
reader = easyocr.Reader(['en'], gpu=False)

@router.post("/ocr")
async def extract_number_plate(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    img = cv2.imread(file_location)
    if img is None:
        os.remove(file_location)
        return {"vehicle_number": ""}

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    results = reader.readtext(
        gray,
        detail=1,
        paragraph=False,
        allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    )

    os.remove(file_location)

    text = "".join(t for _, t, p in results if p > 0.3)
    return {"vehicle_number": text}