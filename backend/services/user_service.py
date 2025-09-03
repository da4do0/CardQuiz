from flask import Flask, request, jsonify
from database import app, db
from models import User
from datetime import datetime

def create_user(username, password):
    try:
        # Controlla se username esiste già
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return None, "Username già esistente"
        
        # Crea nuovo utente
        user = User(username=username, password=password)
        db.session.add(user)
        db.session.commit()
        
        return user, "Utente creato con successo"
    except Exception as e:
        db.session.rollback()
        return None, f"Errore nella creazione: {str(e)}"

def get_user_by_id(user_id):
    try:
        return User.query.get(user_id)
    except Exception as e:
        return None, f"Errore nel recupero: {str(e)}"

def get_all_users():
    """Ottieni tutti gli utenti"""
    try:
        users = User.query.all()
        return users, f"Trovati {len(users)} utenti"
    except Exception as e:
        return [], f"Errore: {str(e)}"

def authenticate_user(username, password):
    try:
        user = User.query.filter_by(username=username).first()
        if user and user.password == password:
            return user, "Autenticazione riuscita"
        else:
            return None, "Credenziali non valide"
    except Exception as e:
        return None, f"Errore nell'autenticazione: {str(e)}"