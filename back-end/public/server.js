import express from "express";
import { Server as SocketIOServer } from "socket.io";
const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});
const io = new SocketIOServer(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET", "POST"],
    },
});
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// Store game lobbies
const lobbies = [];
//find lobby
function findLobbyById(id) {
    return lobbies.find((lobby) => lobby.id === id);
}
//add players to the lobby
function addPlayerToLobby(lobby, playerName) {
    let id = 0;
    if (lobby.players.length >= 1) {
        id = lobby.players[lobby.players.length - 1].id + 1;
    }
    const newPlayer = {
        name: playerName,
        id: id,
    };
    const index = lobbies.indexOf(lobby);
    lobbies[index].players.push(newPlayer);
    return newPlayer.id;
}
function removePlayerFromLobby(lobbyId, playerId) {
    const lobby = findLobby(lobbyId);
    if (lobby) {
        const index = lobby.players.findIndex((player) => player.id === playerId);
        if (index !== -1) {
            lobby.players.splice(index, 1);
        }
    }
}
export function findLobby(lobbyId) {
    return lobbies.find((lobby) => lobby.id === lobbyId);
}
// Define a route to create a new lobby
app.post("/create-lobby", (req, res) => {
    // Create a new lobby with an empty array of players
    let newLobby = {
        id: lobbies.length + Math.random().toString(36).substr(2, 9),
        players: [],
    };
    lobbies.push(newLobby);
    let id = newLobby.id;
    // Send the lobby ID back to the client
    res.json({ id });
});
app.get("/lobbies/:lobbyId", (req, res) => {
    const lobbyId = req.params.lobbyId;
    let lob = findLobbyById(lobbyId);
    // Check if the lobbyId exists in the lobbies object
    if (lob) {
        // Send the lobby information back to the client
        res.json({
            id: lob.id,
            players: lob.players,
        });
    }
    else {
        // If the lobbyId doesn't exist, send a 404 Not Found response
        res.status(404).json({ error: "Lobby not found" });
    }
});
// Define the Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("join-lobby", (data) => {
        const { lobbyId, playerName } = data;
        const lobby = findLobbyById(lobbyId);
        // Check if the lobby exists
        if (lobby) {
            // Add the player to the lobby
            const num = addPlayerToLobby(lobby, playerName);
            console.log("the player that joined id is" + num + " please emmit it");
            // Join the Socket.IO room corresponding to the lobby ID
            socket.join(lobbyId);
            socket.emit("my-id", { id: num });
            // Broadcast to all clients in the lobby that a new player has joined
            io.to(lobbyId).emit("player-joined", { name: playerName, id: num });
            console.log(`${playerName} joined lobby ${lobbyId}`);
        }
        else {
            // If the lobby doesn't exist, inform the client
            console.log("6");
            socket.emit("lobby-not-found", { message: "Lobby not found" });
        }
    });
    socket.on("leave-lobby", (data) => {
        const { lobbyId, playerId } = data;
        removePlayerFromLobby(lobbyId, playerId);
        socket.leave(lobbyId);
        io.to(lobbyId).emit("player-left", { playerId });
        console.log(`${playerId} left lobby ${lobbyId}`);
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
    socket.on("movment", (data) => {
        // console.log("player :" + data.player + " emiited there location");
        io.emit(data.player, { x: data.x, y: data.y, z: data.z });
    });
});
