// Eventi che il client INVIA al server
export const CLIENT_EVENTS = {
  TEST_EVENT: 'test_event',
  CREATE_LOBBY: 'create_lobby',
  JOIN_LOBBY: 'join_lobby',
  LEAVE_LOBBY: 'leave_lobby',
  START_QUIZ: 'start_quiz'
};

// Eventi che il server INVIA al client
export const SERVER_EVENTS = {
  CONNECTED: 'connected',
  TEST_RESPONSE: 'test_response',
  LOBBY_CREATED: 'lobby_created',
  JOINED_LOBBY: 'joined_lobby',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  QUIZ_STARTED: 'quiz_started',
  LOBBY_CLOSED: 'lobby_closed',
  ERROR: 'error'
};