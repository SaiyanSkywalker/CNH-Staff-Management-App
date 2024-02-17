"use client";
import io from "socket.io-client";
import Login from "../components/Login";
import { useEffect } from "react";
export default function Page() {
  // Test code for setting up sockets
  // TODO: DELETE THIS
  useEffect(() => {
    const socket = io("http://localhost:3003");
    socket.on("hello", (arg) => {
      console.log(arg); // world
      socket.emit("hello", "I must've called a thousand times");
    });
  });

  return (
    <>
      <Login />
    </>
  );
}
