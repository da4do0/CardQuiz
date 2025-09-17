from flask_socketio import emit, join_room, leave_room
from flask import request
from services.lobby_service import *

def register_socket_events(socketio):
    """Registra tutti gli eventi WebSocket"""
    
    @socketio.on('connect')
    def handle_connect():
        print(f"Client connesso: {request.sid}")
        emit('connected', {'message': 'Connesso al server WebSocket!'})
    
    @socketio.on('disconnect')
    def handle_disconnect():
        print(f"Client disconnesso: {request.sid}")
    
    @socketio.on('join_quiz')
    def handle_join_quiz(data):
        room = data.get('quiz_id')
        username = data.get('username')

        if room and username:
            join_room(room)
            print(f"User {username} ({request.sid}) joined quiz {room}")
            emit('joined_quiz', {
                'quiz_id': room,
                'username': username,
                'message': f'{username} si è unito al quiz!'
            }, room=room)
        else:
            emit('error', {'message': 'Quiz ID e username sono richiesti'})

    @socketio.on('leave_quiz')
    def handle_leave_quiz(data):
        room = data.get('quiz_id')
        username = data.get('username')

        if room:
            leave_room(room)
            print(f"User {username} ({request.sid}) left quiz {room}")
            emit('left_quiz', {
                'quiz_id': room,
                'username': username,
                'message': f'{username} ha lasciato il quiz'
            }, room=room)

    @socketio.on('quiz_message')
    def handle_quiz_message(data):
        room = data.get('quiz_id')
        message = data.get('message')
        username = data.get('username')

        if room and message and username:
            emit('quiz_message', {
                'username': username,
                'message': message,
                'quiz_id': room
            }, room=room)

    @socketio.on('start_quiz')
    def handle_start_quiz(data):
        room = data.get('quiz_id')
        if room:
            emit('quiz_started', {'quiz_id': room}, room=room)

    @socketio.on('submit_answer')
    def handle_submit_answer(data):
        room = data.get('quiz_id')
        answer = data.get('answer')
        username = data.get('username')
        question_id = data.get('question_id')

        if room and answer and username:
            emit('answer_submitted', {
                'username': username,
                'question_id': question_id,
                'quiz_id': room
            }, room=room)

    @socketio.on('join_room')
    def handle_join_room(data):
        room = data.get('room_id')
        username = data.get('username')
        user_id = data.get('user_id')
        
        print(f"user_id: ${user_id}")

        if room:
            join_room(room)
            
            join_lobby(room, username, user_id, request.sid)

            print(f"User {username} ({request.sid}) joined room {room}")
            emit('user_joined', {
                'username': username,
                'message': f'{username} si è unito alla room!',
                'participants_count': len(active_lobbies.get(room, {}).get('users', []))
            }, room=room)
            handle_list_players(room)

    @socketio.on('leave_room')
    def handle_leave_room(data):
        room = data.get('room_id')
        username = data.get('username')
        user_id = data.get('user_id')

        if room:
            leave_room(room)

            # Rimuovi dalla struttura dati del lobby
            if room in active_lobbies:
                active_lobbies[room]['users'] = [
                    u for u in active_lobbies[room]['users']
                    if u['sid'] != request.sid
                ]

            print(f"User {username} ({request.sid}) left room {room}")
            emit('user_left', {
                'username': username,
                'message': f'{username} ha lasciato la room',
                'participants_count': len(active_lobbies.get(room, {}).get('users', []))
            }, room=room)

    @socketio.on('room_message')
    def handle_room_message(data):
        room = data.get('room_id')
        message = data.get('message')
        username = data.get('username')

        if room and message:
            emit('room_message', {
                'username': username,
                'message': message,
                'room_id': room
            }, room=room)
        
    @socketio.on('list_players')
    def handle_list_players(room):
        emit('list_players', {'players': get_list_players(room)}, room=room)