import { io } from "socket.io-client";
import { backDomain } from "../../Resources/UniversalComponents";

const socket = io(backDomain, {
  path: "/socket.io",
  withCredentials: true,
});

socket.on("connect", () => console.log("SOCKET CONNECTED", socket.id));
socket.on("connect_error", (e) => console.log("CONNECT_ERROR", e.message));

export const registerUser = (studentID) => {
  if (socket.connected) socket.emit("register", studentID);
  else socket.once("connect", () => socket.emit("register", studentID));
};

export default socket;
