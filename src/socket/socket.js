import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 10000,
});

// Connect ONCE (no user, no auth)
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

// Disconnect if needed (optional)
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// Setup all socket event listeners
export const setupSocketListeners = (callbacks = {}) => {
  socket.removeAllListeners();

  // Connection listeners
  socket.on("connect", () => {
  });

  socket.on("disconnect", () => {
  });

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message);
  });

  // DATA EVENT LISTENERS

  // Listen for food claimed events
  socket.on("foodClaimed", (data) => {
    if (callbacks.onFoodClaimed) {
      callbacks.onFoodClaimed(data);
    }
  });

  // Listen for food collected events
  socket.on("foodCollected", (data) => {
    if (callbacks.onFoodCollected) {
      callbacks.onFoodCollected(data);
    }
  });

  // Listen for new food posted events
  socket.on("newFoodPosted", (data) => {
    if (callbacks.onNewFoodPosted) {
      callbacks.onNewFoodPosted(data);
    }
  });

  // Listen for food updated events
  socket.on("foodUpdated", (data) => {
    if (callbacks.onFoodUpdated) {
      callbacks.onFoodUpdated(data);
    }
  });

  // Listen for food deleted events
  socket.on("foodDeleted", (data) => {
    if (callbacks.onFoodDeleted) {
      callbacks.onFoodDeleted(data);
    }
  });

  // Listen for new food posted
  socket.on("new_food_post", (data) => {
    if (callbacks.onNewFoodPost) {
      callbacks.onNewFoodPost(data);
    }
  });

  // Listen for food unavailable (when claimed/collected)
  socket.on("food_unavailable", (data) => {
    if (callbacks.onFoodUnavailable) {
      callbacks.onFoodUnavailable(data);
    }
  });

  //  Listen for food expired
  socket.on("food_expired", (data) => {
    if (callbacks.onFoodExpired) {
      callbacks.onFoodExpired(data);
    }
  });
};

export default socket;