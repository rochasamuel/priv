// useWebSocket.js
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const useWebSocket = () => {
  const url = 'wss://privatus-homol.automatizai.com.br/chat/ws';
  const { data: session } = useSession();
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);

  useEffect(() => {
    // Construct the WebSocket URL with the access token
    if (!session?.user.accessToken) return;

    // Close the existing WebSocket connection before creating a new one
    if (socket) {
      socket.close();
    }

    const newSocket = new WebSocket(`${url}?authorization=${session?.user.accessToken}`);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []); // Empty dependency array to run the effect only once

  // Return any additional data or functions you want to expose
  return {
    socket,
  };
};

export default useWebSocket;
