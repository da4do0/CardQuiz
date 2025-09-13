import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SERVER_EVENTS } from '../types/socket.types';

interface UseSocketReturn {
  socket: any | null;
  isConnected: boolean;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connetti al tuo server Python
    const newSocket = io('http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('✅ Connesso al server WebSocket');
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('❌ Disconnesso dal server WebSocket');
      setIsConnected(false);
    });

    newSocket.on(SERVER_EVENTS.CONNECTED, (data: any) => {
      console.log('Server dice:', data.message);
    });
    
    setSocket(newSocket);
    
    // Cleanup quando il componente si smonta
    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, isConnected };
};