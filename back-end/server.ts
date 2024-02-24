import express, { Request, Response } from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new SocketIOServer(server);

// Store game lobbies
const lobbies: { [lobbyId: string]: string[] } = {};

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Define a route to create a new lobby
app.post("/create-lobby", (req: Request, res: Response) => {
  // Generate a unique lobby ID
  const lobbyId = Math.random().toString(36).substr(2, 9);

  // Create a new lobby with an empty array of players
  lobbies[lobbyId] = [];

  // Send the lobby ID back to the client
  res.json({ lobbyId });
});

// Define the Socket.IO connection handler
io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  // Listen for a player joining a lobby
  socket.on("join-lobby", (data: { lobbyId: string; playerName: string }) => {
    const { lobbyId, playerName } = data;

    // Check if the lobby exists
    if (lobbies[lobbyId]) {
      // Add the player to the lobby
      lobbies[lobbyId].push(playerName);

      // Join the Socket.IO room corresponding to the lobby ID
      socket.join(lobbyId);

      // Broadcast to all clients in the lobby that a new player has joined
      io.to(lobbyId).emit("player-joined", { playerName });

      console.log(`${playerName} joined lobby ${lobbyId}`);
    } else {
      // If the lobby doesn't exist, inform the client
      socket.emit("lobby-not-found", { message: "Lobby not found" });
    }
  });

  // Listen for a player leaving a lobby
  socket.on("leave-lobby", (data: { lobbyId: string; playerName: string }) => {
    const { lobbyId, playerName } = data;

    // Remove the player from the lobby
    lobbies[lobbyId] = lobbies[lobbyId].filter((name) => name !== playerName);

    // Leave the Socket.IO room corresponding to the lobby ID
    socket.leave(lobbyId);

    // Broadcast to all clients in the lobby that a player has left
    io.to(lobbyId).emit("player-left", { playerName });

    console.log(`${playerName} left lobby ${lobbyId}`);
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
