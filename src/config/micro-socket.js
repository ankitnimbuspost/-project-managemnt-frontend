import { io } from "socket.io-client";
import { authenticateUser } from "../services/CommonFunction";
const user = authenticateUser();
let backend_url = process.env.REACT_APP_SOCKET_TASK_URL ?? 'URL not found';
// Initialize Socket.IO connection
const micro_socket = io(backend_url, {
    extraHeaders: {
        auth: user.access_token,
    },
    // transports: ["websocket"], // Use WebSocket for real-time efficiency
    // withCredentials: true, // Needed if backend has CORS enabled
    reconnection: true, // Enable auto-reconnect
    reconnectionAttempts: 5, // Retry 5 times before failing
    reconnectionDelay: 3000, // Wait 3 seconds between retries
});

export default micro_socket;
