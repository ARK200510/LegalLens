import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def translate_text(text, target_language):
    try:
        prompt = f"""
Translate the following text into {target_language}.

Only return the translated text.
Do not include anything else.
Do not use english words in the translated text.
Do not repeat the same text.
Text:
{text}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        output = response.choices[0].message.content.strip()

        # 🔥 cleanup (IMPORTANT)
        output = output.replace("**", "")
        output = output.replace("<START>", "").replace("<END>", "")

        return output.strip()

    except Exception as e:
        return f"Translation Error: {str(e)}"