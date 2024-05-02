import express, { Request, Response } from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import { LobbyResponse, Player } from "./lobby.js";

import { Lobby } from "./db.js";
import { Model, Types } from "mongoose";

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
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

//find lobby
async function generateLobbyResponse(
  id: string
): Promise<LobbyResponse | undefined> {
  const lobby = await Lobby.findOne({ lobbyId: id });
  if (lobby) {
    const returnLobby: LobbyResponse = {
      lobbyId: lobby.lobbyId,
      players: [],
    };
    lobby.players?.forEach((e) => {
      const player: Player = { gameId: e.gameId, name: e.name! };
      returnLobby.players.push(player);
    });
    return returnLobby;
  } else return undefined;
}
//add players to the lobby
async function addPlayerToLobby(
  id: string,
  playerName: string
): Promise<number | undefined> {
  const lobby = await Lobby.findOne({ lobbyId: id });
  if (lobby) {
    const addedPlayerId = lobby.players?.length;
    lobby.players?.push({ gameId: addedPlayerId, name: playerName });
    await lobby.save();
    return addedPlayerId;
  } else return undefined;
}

async function removePlayerFromLobby(
  lobbyId: string,
  playerId: number
): Promise<void> {
  const lobby = await Lobby.findOne({ lobbyId: lobbyId });
  if (lobby) {
    lobby.players?.pull({ gameId: playerId });
    await lobby.save();
  }
}

// Define a route to create a new lobby
app.post(
  "/create-lobby",
  async (req: Request<String>, res: Response<{ error: string } | string>) => {
    try {
      const name: string = req.body.name;
      console.log("hi " + name);

      const newLobby = new Lobby({
        lobbyId: Math.random().toString(36).substr(2, 9),
      });
      await newLobby
        .save()
        .then(() => {
          res.status(201).json(newLobby.lobbyId);
        })
        .catch((error) => {
          if (error.code === 11000) {
            res
              .status(201)
              .json({ error: "create: You are already in a lobby " + error });
          } else {
            res.status(201).json({ error: `${error.code}` });
          }
        });
    } catch (error) {
      console.error("Error creating Lobby:", error);
      res
        .status(500)
        .json({ error: "An error occurred while registering the user" });
    }
  }
);
// const test = async () => {
//   const newUser = new Room({
//     lobbyId: "2",
//     players: [
//
//     ],
//   });
//   await newUser.save();
// };
// test();
app.post("/register");

app.get("/lobbies/:lobbyId", async (req: Request, res: Response) => {
  const lobbyId = req.params.lobbyId;
  const response: LobbyResponse | undefined = await generateLobbyResponse(
    lobbyId
  );
  if (response) {
    console.log(`this is the lobby name${response.lobbyId!}`);

    res.status(201).json(response);
  } else {
    res.status(404).json({ error: "Lobby doesnt exsist" });
  }
});

// Define the Socket.IO connection handler
io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  socket.on(
    "join-lobby",
    async (data: { lobbyId: string; playerName: string }) => {
      const { lobbyId, playerName } = data;
      const lobby = await Lobby.findOne({ lobbyId: lobbyId });

      if (lobby) {
        const num = lobby!.players!.length;
        lobby!.players?.push({
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
        await lobby
          .save()
          .then(() => {
            socket.emit("error", { error: "" });
          })
          .catch((error) => {
            if (error.code === 11000) {
              socket.emit("error", {
                error: "join: you are already in a lobby",
              });
            } else {
              socket.emit("error", { error: `${error.code}` });
            }
          });
      } else {
        console.log("6");
        socket.emit("error", { error: `lobby not found` });
      }
    }
  );

  socket.on(
    "leave-lobby",
    async (data: { lobbyId: string; playerId: number }) => {
      const { lobbyId, playerId } = data;

      await removePlayerFromLobby(lobbyId, playerId);
      console.log(`removing player ${playerId}from lobby ${lobbyId}`);
      socket.leave(lobbyId);

      io.to(lobbyId).emit("player-left", { playerId });

      console.log(`${playerId} left lobby ${lobbyId}`);
    }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
  socket.on(
    "movment",
    (data: { player: string; x: number; y: number; z: number }) => {
      // console.log("player :" + data.player + " emiited there location");
      io.emit(data.player, { x: data.x, y: data.y, z: data.z });
    }
  );
});
