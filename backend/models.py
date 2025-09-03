from database import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Domanda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    testo = db.Column(db.String(500), nullable=False)
    risposta_1 = db.Column(db.String(200), nullable=False)
    risposta_2 = db.Column(db.String(200), nullable=False)
    risposta_3 = db.Column(db.String(200), nullable=True)
    risposta_4 = db.Column(db.String(200), nullable=True)
    risposta_corretta = db.Column(db.String(200), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)

class Risposta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    risposta_data = db.Column(db.String(200), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)