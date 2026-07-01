from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_entities(text):
    text = text[:2000]

    prompt = f"""
Extract the following entities from the document:

- Acts
- Dates
- Courts
- Persons

Return ONLY valid JSON in this format:
{{
  "acts": [],
  "dates": [],
  "courts": [],
  "persons": []
}}

Do NOT add explanation or extra text.

Document:
{text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    output = response.choices[0].message.content.strip()

    try:
        # 🔥 Extract JSON safely (even if extra text present)
        start = output.find("{")
        end = output.rfind("}") + 1
        json_str = output[start:end]

        return json.loads(json_str)

    except Exception as e:
        print("Entity parsing failed:", output)  # debug ke liye
        return {
            "acts": [],
            "dates": [],
            "courts": [],
            "persons": []
        }