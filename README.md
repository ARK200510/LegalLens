# ⚖️ LegalLens – AI Powered Legal Document Assistant

LegalLens is an AI-powered web application designed to simplify legal document analysis. It enables users to upload legal documents, automatically classify them, generate concise summaries, extract important legal entities, translate content into multiple languages, and interact with an AI assistant for legal document understanding.

---

## 🚀 Features

- 📄 Upload and analyze legal documents
- 🤖 AI-powered document classification
- 📝 Automatic document summarization
- 🏷️ Named Entity Recognition (People, Organizations, Dates, Laws, etc.)
- 🌐 Multi-language translation
- 💬 AI Chat Assistant for legal document queries
- 🔐 Secure user authentication
- 📂 Document history management

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Flask
- SQLite

### AI & NLP
- Hugging Face Transformers
- PyTorch
- Tokenizers

---

## 📁 Project Structure

```text
LegalLens/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── legal_model/
│   ├── models/
│   ├── services/
│   └── utils/
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── data/
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ARK200510/LegalLens.git
cd LegalLens
```

---

### 2️⃣ Backend Setup

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python backend/app.py
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on:

```
http://localhost:3000
```

---

## 🧠 AI Model

The trained model file (`model.safetensors`) is **not included** in this repository because it exceeds GitHub's file size limit.

Place the downloaded model inside:

```text
backend/legal_model/
```

---

## 📷 Application Modules

- User Authentication
- Document Upload
- Document Classification
- AI Summarization
- Entity Extraction
- Translation
- AI Chat Assistant
- History Management

---

## 📌 Future Improvements

- Voice-based legal assistant
- OCR support for scanned PDFs
- Advanced legal search
- Court judgement prediction
- Cloud deployment
- Role-based authentication
- Multi-document comparison

---



---

## 📄 License

This project is developed for educational and learning purposes.
