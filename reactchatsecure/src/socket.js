import { io } from "socket.io-client";

// PUBLIC_INTERFACE
// Update the SERVER_URL as needed:
const SERVER_URL = "http://localhost:4000";

// Create and export a singleton socket connection
export const socket = io(SERVER_URL, {
  autoConnect: false // We connect only when required
});
