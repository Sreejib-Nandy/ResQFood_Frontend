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
    console.log("Connecting global socket...");
  }
};

// Disconnect if needed (optional)
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};

export const setupGlobalDebugListener = () => {
  socket.onAny((eventName, ...args) => {
    console.log(`SOCKET EVENT RECEIVED: "${eventName}"`, args);
  });
};

// Setup all socket event listeners
export const setupSocketListeners = (callbacks = {}) => {
  socket.removeAllListeners();

  // Connection listeners
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message);
  });

  // DATA EVENT LISTENERS

  // Listen for food claimed events
  socket.on("foodClaimed", (data) => {
    console.log("Food claimed:", data);
    if (callbacks.onFoodClaimed) {
      callbacks.onFoodClaimed(data);
    }
  });

  // Listen for food collected events
  socket.on("foodCollected", (data) => {
    console.log("Food collected:", data);
    if (callbacks.onFoodCollected) {
      callbacks.onFoodCollected(data);
    }
  });

  // Listen for new food posted events
  socket.on("newFoodPosted", (data) => {
    console.log("New food posted:", data);
    if (callbacks.onNewFoodPosted) {
      callbacks.onNewFoodPosted(data);
    }
  });

  // Listen for food updated events
  socket.on("foodUpdated", (data) => {
    console.log("Food updated:", data);
    if (callbacks.onFoodUpdated) {
      callbacks.onFoodUpdated(data);
    }
  });

  // Listen for food deleted events
  socket.on("foodDeleted", (data) => {
    console.log("Food deleted:", data);
    if (callbacks.onFoodDeleted) {
      callbacks.onFoodDeleted(data);
    }
  });

  // Listen for new food posted
  socket.on("new_food_post", (data) => {
    console.log("New food posted:", data);
    if (callbacks.onNewFoodPost) {
      callbacks.onNewFoodPost(data);
    }
  });

  // Listen for food unavailable (when claimed/collected)
  socket.on("food_unavailable", (data) => {
    console.log("Food unavailable:", data);
    if (callbacks.onFoodUnavailable) {
      callbacks.onFoodUnavailable(data);
    }
  });

  //  Listen for food expired
  socket.on("food_expired", (data) => {
    console.log("Food expired:", data);
    if (callbacks.onFoodExpired) {
      callbacks.onFoodExpired(data);
    }
  });
};

export default socket;