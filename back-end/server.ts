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
  let id = 0;
  if (lobby.players.length >= 1) {
    id = lobby.players[lobby.players.length - 1].id! + 1;
  }
  const newPlayer: Player = {
    name: playerName,
    id: id,
  };
  const index = lobbies.indexOf(lobby);
  lobbies[index].players.push(newPlayer);
  return newPlayer.id;
}

function removePlayerFromLobby(lobbyId: string, playerId: number): void {
  lobbies
    .find((lobby) => lobby.id === lobbyId)
    ?.players.filter((player) => player.id !== playerId);

  lobbies
    .find((lobby) => lobby.id === lobbyId)
    ?.players.forEach((player) => {
      console.log(player.name + ", ");
    });
}

// Define a route to create a new lobby
app.post("/create-lobby", (req: Request, res: Response) => {
  // Create a new lobby with an empty array of players
  let newLobby: Lobby = {
    id: lobbies.length + Math.random().toString(36).substr(2, 9),
    players: [],
  };
  lobbies.push(newLobby);
  let id = newLobby.id;
  // Send the lobby ID back to the client
  res.json({ id });
});

app.get("/lobbies/:lobbyId", (req: Request, res: Response) => {
  const lobbyId = req.params.lobbyId;
  let lob = findLobbyById(lobbyId);
  // Check if the lobbyId exists in the lobbies object
  if (lob) {
    // Send the lobby information back to the client
    res.json({
      id: lob.id,
      players: lob.players,
    });
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
      socket.emit("my-id", { id: num });
      // Broadcast to all clients in the lobby that a new player has joined
      io.to(lobbyId).emit("player-joined", { name: playerName, id: num });
      console.log(`${playerName} joined lobby ${lobbyId}`);
    } else {
      // If the lobby doesn't exist, inform the client
      console.log("6");
      socket.emit("lobby-not-found", { message: "Lobby not found" });
    }
  });

  socket.on("leave-lobby", (data: { lobbyId: string; playerId: number }) => {
    const { lobbyId, playerId } = data;

    removePlayerFromLobby(lobbyId, playerId);

    socket.leave(lobbyId);

    io.to(lobbyId).emit("player-left", { playerId });

    console.log(`${playerId} left lobby ${lobbyId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
