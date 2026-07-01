from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def summarize_text(text, doc_type):
    text = text[:4000]

    if doc_type == "legal":
        prompt = f"""
Explain the following legal case in 7-10 sentences.

Write a clean, continuous paragraph.

Do NOT:
- use headings
- use bullet points
- use sections like "Key Highlights" or "Important Information"
- start with phrases like "Let's break down" or "In this case"

Explain clearly:
- what the case is about
- parties involved
- key issue
- court reasoning and current status

Use simple and professional language. Avoid legal jargon.

Document:
{text}
"""
    else:
        prompt = f"""
Summarize the following document in 5-7 sentences.

Write a clean, continuous paragraph.

Do NOT:
- use headings
- use bullet points
- use sections like "Key Highlights" or "Important Information"

Use simple and clear English.

Document:
{text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "You are an intelligent document assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content.strip()