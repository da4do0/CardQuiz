from database import app, db

# Import models
from models import User, Quiz, Domanda, Risposta

def create_database():
    with app.app_context():
        db.create_all()
        print("✅ Database creato!")

if __name__ == '__main__':
    create_database()