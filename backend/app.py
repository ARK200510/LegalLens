from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Depends, Header
from sqlalchemy.orm import Session

from utils.pdf_reader import extract_text_from_pdf
from services.predictor import predict
from services.summarizer import summarize_text
from services.translator import translate_text
from services.doc_classifier import classify_document_type
from services.entity_extractor import extract_entities
from services.auth import create_user, login_user, get_db, get_current_user

from database import engine, Base
from models.document_model import Document

# 🆕 CHAT IMPORTS
from pydantic import BaseModel
from groq import Groq
import os

# 🔥 Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# 🆕 Groq Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 SIGNUP
@app.post("/signup/")
def signup(email: str, password: str, db: Session = Depends(get_db)):
    create_user(email, password, db)
    return {"message": "User created successfully"}

# 🔹 LOGIN
@app.post("/login/")
def login(email: str, password: str, db: Session = Depends(get_db)):
    token = login_user(email, password, db)
    return {"access_token": token}


# ============================================================
# 📄 UPLOAD
# ============================================================
@app.post("/upload/")
async def upload_file(
    file: UploadFile = File(...),
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)

    content = await file.read()

    # 🔥 Extract text
    text = extract_text_from_pdf(content)

    print("TEXT LENGTH:", len(text))  # 🧪 DEBUG

    # 🔹 ML Prediction
    label, confidence = predict(text[:1000] if text else "")

    # 🔹 LLM Classification
    doc_category = classify_document_type(text)

    print("CATEGORY:", doc_category)  # 🧪 DEBUG

    legal_types = [
        "Criminal Case",
        "Civil Case",
        "Divorce / Family Case",
        "Property Case",
        "Employment / Labor Case"
    ]

    doc_type = "legal" if doc_category in legal_types else "non-legal"

    # 🔹 Title extraction
    lines = [line.strip() for line in text.split("\n") if line.strip() != ""]

    title = "No Title Found"

    for line in lines[:10]:
        if "vs" in line.lower() or "v." in line.lower():
            title = line
            break

    if title == "No Title Found" and len(lines) > 0:
        title = lines[0]

    # 🔥 SUMMARY (SAFE)
    summary = summarize_text(text, doc_type)

    print("SUMMARY:", summary)  # 🧪 DEBUG

    if not summary or not summary.strip():
        summary = "Summary could not be generated for this document."

    # 🔹 Entities
    entities = extract_entities(text)

    # 🔥 SAVE TO DATABASE
    doc = Document(
        filename=file.filename,
        summary=summary,
        category=doc_category or "Unknown",
        user_id=user.id
    )

    db.add(doc)
    db.commit()

    # 🔹 Translations
    languages = ["Hindi", "Marathi"]
    translations = {}

    for lang in languages:
        try:
            translations[lang.lower()] = translate_text(summary, lang)
        except:
            translations[lang.lower()] = "Translation not available."

    # 🔹 Final Response
    return {
        "filename": file.filename,
        "prediction": "Legal" if doc_type == "legal" else "Non-Legal",
        "confidence": round(confidence, 3),
        "title": title,
        "category": doc_category or "Unknown",
        "entities": entities,
        "english": summary,
        **translations
    }


# ============================================================
# 📜 HISTORY
# ============================================================
@app.get("/history/")
def get_history(
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)

    docs = db.query(Document).filter(Document.user_id == user.id).all()

    history = []

    for doc in docs:
        history.append({
            "filename": doc.filename,
            "category": doc.category,
            "summary": doc.summary,
            "created_at": doc.created_at
        })

    return {"history": history}


# ============================================================
# 🤖 CHATBOT
# ============================================================

class ChatRequest(BaseModel):
    message: str


@app.post("/chat/")
async def chat_with_document(
    request: ChatRequest,
    token: str = Header(...),
    db: Session = Depends(get_db)
):
    user = get_current_user(token, db)

    user_message = request.message

    # 🔥 Latest doc
    latest_doc = (
        db.query(Document)
        .filter(Document.user_id == user.id)
        .order_by(Document.created_at.desc())
        .first()
    )

    if not latest_doc:
        document_context = ""
        entities_context = {}
    else:
        document_context = latest_doc.summary or ""
        entities_context = extract_entities(document_context)

    system_prompt = f"""
You are an AI Legal Assistant.

Use ONLY the provided document summary and entities.

If information is missing, say:
"The information is not available in the document."

Document Summary:
{document_context}

Entities:
{entities_context}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.2
        )

        return {
            "response": response.choices[0].message.content
        }

    except Exception as e:
        return {"error": str(e)}