from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def classify_document_type(text):
    text = text[:1500]

    prompt = f"""
Classify the following document into ONE of these categories:

LEGAL TYPES:
- Criminal Case
- Civil Case
- Divorce / Family Case
- Property Case
- Employment / Labor Case

NON-LEGAL TYPES:
- Resume
- Report
- Research Paper
- General Document

Return ONLY the category name (e.g., Resume, Criminal Case).
Do NOT include "LEGAL TYPES" or "NON-LEGAL TYPES".

Document:
{text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    # 🔥 Clean output
    output = response.choices[0].message.content.strip()
    output = output.replace("NON-LEGAL TYPES:", "")
    output = output.replace("LEGAL TYPES:", "")

    return output.strip()