from sqlalchemy.orm import Session
from models.user_model import User
from database import SessionLocal
from fastapi import HTTPException
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "secret123"  # later env me dalenge

# 🔹 DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔹 Signup
def create_user(email: str, password: str, db: Session):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(email=email, password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# 🔹 Login
def login_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()

    if not user or user.password != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.utcnow() + timedelta(hours=2)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return token

def get_current_user(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")

        user = db.query(User).filter(User.id == user_id).first()
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")