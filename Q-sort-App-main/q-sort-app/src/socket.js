import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
});

// "undefined" means the URL will be computed from the `window.location` object
const server_URL =
  process.env.NODE_ENV === "production" ? undefined : "http://ws-server:3000";
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

const socket = io(server_URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

export default socket;
