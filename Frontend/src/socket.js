import { io } from "socket.io-client";
import APIEndpoints from "./components/endPoints";

const Endpoints = new APIEndpoints();

const socket = io(Endpoints.BASE_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, 
});

export default socket;