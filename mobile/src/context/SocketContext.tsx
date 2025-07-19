import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/constants";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (roomId: string, message: string) => void;
  sendReaction: (roomId: string, reaction: string) => void;
  controlTrack: (
    roomId: string,
    action: string,
    track?: any,
    currentTime?: number
  ) => void;
  seekTrack: (roomId: string, currentTime: number) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      socketRef.current = io(SOCKET_URL, {
        auth: {
          token,
          userId: user.id,
        },
        transports: ["websocket"],
      });

      const socket = socketRef.current;

      // Connection event handlers
      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      // Cleanup on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        setIsConnected(false);
      };
    }
  }, [user, token]);

  const joinRoom = (roomId: string) => {
    if (socketRef.current && user) {
      socketRef.current.emit("join-room", {
        roomId,
        userId: user.id,
      });
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socketRef.current && user) {
      socketRef.current.emit("leave-room", {
        roomId,
        userId: user.id,
      });
    }
  };

  const sendMessage = (roomId: string, message: string) => {
    if (socketRef.current && user) {
      socketRef.current.emit("send-message", {
        roomId,
        userId: user.id,
        message,
      });
    }
  };

  const sendReaction = (roomId: string, reaction: string) => {
    if (socketRef.current && user) {
      socketRef.current.emit("send-reaction", {
        roomId,
        userId: user.id,
        reaction,
      });
    }
  };

  const controlTrack = (
    roomId: string,
    action: string,
    track?: any,
    currentTime?: number
  ) => {
    if (socketRef.current && user) {
      socketRef.current.emit("track-control", {
        roomId,
        action,
        track,
        currentTime,
      });
    }
  };

  const seekTrack = (roomId: string, currentTime: number) => {
    if (socketRef.current && user) {
      socketRef.current.emit("track-seek", {
        roomId,
        currentTime,
      });
    }
  };

  const value: SocketContextType = {
    socket: socketRef.current,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendReaction,
    controlTrack,
    seekTrack,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
