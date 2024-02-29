import express, { Request, Response } from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Lobby, Player } from "./lobby.js";

// Create Express app and HTTP server
const app = express();
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});

// Initialize Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["GET", "POST"],
  },
});
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

// Store game lobbies
const lobbies: Lobby[] = [];
//find lobby
function findLobbyById(id: string): Lobby | undefined {
  return lobbies.find((lobby) => lobby.id === id);
}
//add players to the lobby
function addPlayerToLobby(lobby: Lobby, playerName: string): number {
  const newPlayer: Player = {
    name: playerName,
    id: lobby.Players.length,
  };
  lobby.Players.push(newPlayer);
  return lobby.Players.length - 1;
}

function removePlayerFromLobby(lobbyId: string, playerName: string): void {
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (lobby) {
    const playerIndex = lobby.Players.findIndex(
      (player) => player.name === playerName
    );
    if (playerIndex !== -1) {
      const removedPlayer = lobby.Players.splice(playerIndex, 1)[0];
      console.log(`Removed player ${removedPlayer.name} from lobby ${lobbyId}`);
    } else {
      console.log(`Player ${playerName} not found in lobby ${lobbyId}`);
    }
  } else {
    console.log(`Lobby with ID ${lobbyId} not found.`);
  }
}

// Define a route to create a new lobby
app.post("/create-lobby", (req: Request, res: Response) => {
  // Create a new lobby with an empty array of players
  let newLobby = new Lobby();
  lobbies.push(newLobby);
  let id = newLobby.id;
  // Send the lobby ID back to the client
  res.json({ id });
});
app.get("/lobbies/:lobbyId", (req: Request, res: Response) => {
  const lobbyId = req.params.lobbyId;

  // Check if the lobbyId exists in the lobbies object
  if (findLobbyById(lobbyId)) {
    // Send the lobby information back to the client
    res.json({ lobbyId, players: findLobbyById(lobbyId)?.Players });
  } else {
    // If the lobbyId doesn't exist, send a 404 Not Found response
    res.status(404).json({ error: "Lobby not found" });
  }
});

// Define the Socket.IO connection handler
io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  socket.on("join-lobby", (data: { lobbyId: string; playerName: string }) => {
    const { lobbyId, playerName } = data;
    const lobby = findLobbyById(lobbyId);
    // Check if the lobby exists
    if (lobby) {
      // Add the player to the lobby
      const num = addPlayerToLobby(lobby, playerName);

      // Join the Socket.IO room corresponding to the lobby ID
      socket.join(lobbyId);

      // Broadcast to all clients in the lobby that a new player has joined
      io.to(lobbyId).emit("player-joined", { name: playerName, id: num });
      console.log(`${playerName} joined lobby ${lobbyId}`);
    } else {
      // If the lobby doesn't exist, inform the client
      console.log("6");
      socket.emit("lobby-not-found", { message: "Lobby not found" });
    }
  });

  socket.on("leave-lobby", (data: { lobbyId: string; playerName: string }) => {
    const { lobbyId, playerName } = data;

    // Remove the player from the lobby
    removePlayerFromLobby(lobbyId, playerName);

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
