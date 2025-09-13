from flask_socketio import emit, join_room, leave_room
from flask import request

def register_socket_events(socketio):
    """Registra tutti gli eventi WebSocket"""
    
    @socketio.on('connect')
    def handle_connect():
        print(f"Client connesso: {request.sid}")
        emit('connected', {'message': 'Connesso al server WebSocket!'})
    
    @socketio.on('disconnect')
    def handle_disconnect():
        print(f"Client disconnesso: {request.sid}")
    
    @socketio.on('test_event')
    def handle_test(data):
        print(f"Test ricevuto: {data}")
        emit('test_response', {'message': 'Test funziona!', 'received': data})