var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { Lobby } from "./db.js";
const app = express();
app.use(express.json());
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
//find lobby
function generateLobbyResponse(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const lobby = yield Lobby.findOne({ lobbyId: id });
        if (lobby) {
            const returnLobby = {
                lobbyId: lobby.lobbyId,
                players: [],
            };
            (_a = lobby.players) === null || _a === void 0 ? void 0 : _a.forEach((e) => {
                const player = { gameId: e.gameId, name: e.name };
                returnLobby.players.push(player);
            });
            return returnLobby;
        }
        else
            return undefined;
    });
}
function addPlayerToLobby(id, playerName) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const lobby = yield Lobby.findOne({ lobbyId: id });
        if (lobby) {
            const addedPlayerId = (_a = lobby.players) === null || _a === void 0 ? void 0 : _a.length;
            (_b = lobby.players) === null || _b === void 0 ? void 0 : _b.push({ gameId: addedPlayerId, name: playerName });
            yield lobby.save();
            return addedPlayerId;
        }
        else
            return undefined;
    });
}
function removePlayerFromLobby(lobbyId, playerId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const lobby = yield Lobby.findOne({ lobbyId: lobbyId });
        if (lobby) {
            (_a = lobby.players) === null || _a === void 0 ? void 0 : _a.pull({ gameId: playerId });
            yield lobby.save();
        }
    });
}
// Define a route to create a new lobby
app.post("/create-lobby", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.body.playerName;
        console.log("hi" + name);
        const newLobby = new Lobby({
            lobbyId: Math.random().toString(36).substr(2, 9),
            players: [],
        });
        yield newLobby
            .save()
            .then(() => {
            res.status(201).json(newLobby.lobbyId);
        })
            .catch((error) => {
            if (error.code === 11000) {
                res.status(201).send(error);
            }
            else {
                res.status(201).send({ error: `${error.code}: ${error.body}` });
            }
        });
    }
    catch (error) {
        console.error("Error creating Lobby:", error);
        res.status(500).send({
            error: `An error occurred while registering the user: ${error}`,
        });
    }
}));
app.get("/lobbies/:lobbyId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lobbyId = req.params.lobbyId;
    const response = yield generateLobbyResponse(lobbyId);
    if (response) {
        console.log(`this is the lobby name${response.lobbyId}`);
        res.status(201).json(response);
    }
    else {
        res.status(404).json({ error: "Lobby doesnt exsist" });
    }
}));
// Define the Socket.IO connection handler
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("join-lobby", (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { lobbyId, playerName } = data;
        const lobby = yield Lobby.findOne({ lobbyId: lobbyId });
        if (lobby) {
            const num = lobby.players.length;
            (_a = lobby.players) === null || _a === void 0 ? void 0 : _a.push({
                gameId: num,
                name: playerName,
            });
            console.log("the player that joined id is" + num + " please emmit it");
            // Join the Socket.IO room corresponding to the lobby ID
            socket.join(lobbyId);
            socket.emit("my-id", { id: num });
            // Broadcast to all clients in the lobby that a new player has joined
            io.to(lobbyId).emit("player-joined", { name: playerName, id: num });
            console.log(`${playerName} joined lobby ${lobbyId}`);
            yield lobby
                .save()
                .then(() => {
                socket.emit("error", { error: "" });
            })
                .catch((error) => {
                if (error.code === 11000) {
                    socket.emit("error", {
                        error: "join: you are already in a lobby",
                    });
                }
                else {
                    socket.emit("error", { error: `${error.code}` });
                }
            });
        }
        else {
            console.log("6");
            socket.emit("error", { error: `lobby not found` });
        }
    }));
    socket.on("leave-lobby", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { lobbyId, playerId } = data;
        yield removePlayerFromLobby(lobbyId, playerId);
        console.log(`removing player ${playerId}from lobby ${lobbyId}`);
        socket.leave(lobbyId);
        io.to(lobbyId).emit("player-left", { playerId });
        console.log(`${playerId} left lobby ${lobbyId}`);
    }));
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
    socket.on("movment", (data) => {
        // console.log("player :" + data.player + " emiited there location");
        io.emit(data.player, { x: data.x, y: data.y, z: data.z });
    });
});
