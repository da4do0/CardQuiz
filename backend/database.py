from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Configurazione Flask e Database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz_game.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Inizializzazione SQLAlchemy
db = SQLAlchemy(app)

# IMPORTANTE: Importa i models DOPO aver definito db
from models import *

# Funzioni di utilità per il database
def init_db():
    """Crea tutte le tabelle nel database"""
    # Import qui per evitare errori circolari
    from models import User, Quiz, Domanda, Risposta
    
    with app.app_context():
        db.create_all()
        print("✅ Database creato con successo!")
        print(f"📁 File database: {app.config['SQLALCHEMY_DATABASE_URI']}")

def drop_db():
    """Elimina tutte le tabelle dal database"""
    from models import User, Quiz, Domanda, Risposta
    
    with app.app_context():
        db.drop_all()
        print("🗑️ Database eliminato!")

def reset_db():
    """Resetta il database (drop + create)"""
    from models import User, Quiz, Domanda, Risposta
    
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("🔄 Database resettato con successo!")

if __name__ == '__main__':
    print("🛠️ Setup Database Quiz Game")
    print("=" * 30)
    
    choice = input("Cosa vuoi fare?\n1. Crea database\n2. Resetta database\n3. Elimina database\nScelta (1-3): ")
    
    if choice == '1':
        init_db()
    elif choice == '2':
        reset_db()
    elif choice == '3':
        drop_db()
    else:
        print("❌ Scelta non valida!")
    
    print("\nFatto! 🎉")