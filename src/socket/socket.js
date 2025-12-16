import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL; 
// must equal: https://resqfood.onrender.com

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err.message);
});

export default socket;
