from flask import Flask, request, jsonify
from database import app, db
from models import Quiz, Domanda
from datetime import datetime

def create_quiz(userId, title, questions):
    try:
        print("Creating quiz with title:", title)
        print("Questions:", questions)
        print("User ID:", userId)
        # Crea nuovo quiz
        quiz = Quiz(nome=title, data=datetime.utcnow(), user_id=userId)
        db.session.add(quiz)
        db.session.commit()
        
        # Aggiungi domande al quiz
        for q in questions:
            options = q['options']
            question = Domanda(
                testo=q['text'],
                risposta_1=options[0] if len(options) > 0 else None,
                risposta_2=options[1] if len(options) > 1 else None,
                risposta_3=options[2] if len(options) > 2 else None,
                risposta_4=options[3] if len(options) > 3 else None,
                risposta_corretta=q['correctAnswer'],
                quiz_id=quiz.id
            )
            db.session.add(question)
        
        db.session.commit()
        return quiz, "Quiz creato con successo"
    except Exception as e:
        db.session.rollback()
        return None, f"Errore nella creazione del quiz: {str(e)}"

def get_quiz_by_id(quiz_id):
    try:
        quiz = Quiz.query.get(quiz_id)
        if quiz:
            return quiz, "Quiz trovato"
        else:
            return None, "Quiz non trovato"
    except Exception as e:
        return None, f"Errore nel recupero del quiz: {str(e)}"

def get_quizzes_by_user(user_id):
    try:
        quizzes = Quiz.query.filter_by(user_id=user_id).order_by(Quiz.data.desc()).all()
        response = []
        
        for quiz in quizzes:
            count_domande = get_count_questions_in_quiz(quiz.id)
            quiz_obj = {
                "id": quiz.id,
                "nome": quiz.nome,
                "data": quiz.data,
                "user_id": quiz.user_id,
                "question_count": count_domande
            }
            response.append(quiz_obj)

        return response, "Quizzes recuperati con successo"
    except Exception as e:
        return None, f"Errore nel recupero dei quiz dell'utente: {str(e)}"

def get_quiz_with_questions(quiz_id):
    try:
        quiz = Quiz.query.get(quiz_id)
        if quiz:
            questions = Domanda.query.filter_by(quiz_id=quiz_id).all()
            return quiz, questions, "Quiz con domande trovato"
        else:
            return None, None, "Quiz non trovato"
    except Exception as e:
        return None, None, f"Errore nel recupero del quiz con domande: {str(e)}"

def get_count_questions_in_quiz(quiz_id):
    try:
        count = Domanda.query.filter_by(quiz_id=quiz_id).count()
        return count
    except Exception as e:
        return 0

def get_all_quizzes():
    try:
        quizzes = Quiz.query.all()
        return quizzes, "Tutti i quiz recuperati con successo"
    except Exception as e:
        return None, f"Errore nel recupero di tutti i quiz: {str(e)}"