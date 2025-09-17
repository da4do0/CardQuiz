from flask import Flask, request, jsonify
from database import app, db
from models import Quiz, User
from datetime import datetime
import uuid
import hashlib
import time

# In-memory storage for lobbies (in production, use Redis or database)
active_lobbies = {}

def get_uuid_code(quiz_id):
    """
    Genera un codice univoco di 6 caratteri basato su quiz_id e timestamp
    """
    
    # Combina quiz_id con timestamp corrente per unicità
    data = f"{quiz_id}_{int(time.time() * 1000000)}"
    
    # Crea hash MD5 e prende i primi 6 caratteri in maiuscolo
    hash_object = hashlib.md5(data.encode())
    return hash_object.hexdigest()[:6].upper()

def create_lobby(quiz_id):
    id_lobby = get_uuid_code(quiz_id)
    print(id_lobby)
    active_lobbies[id_lobby] = {"quiz_id": quiz_id, "users": []}
    return id_lobby

def join_lobby(room, username, user_id, sid):
    if room in active_lobbies:
        user_data = {
            'sid': sid,
            'username': username,
            'user_id': user_id
        }
        # Controlla se l'utente non è già nella lista
        if not any(u['user_id'] == user_id for u in active_lobbies[room]['users']):
            active_lobbies[room]['users'].append(user_data)

def get_list_players(room):
    if active_lobbies[room]:
        print(active_lobbies[room]['users'])
        return active_lobbies[room]['users']