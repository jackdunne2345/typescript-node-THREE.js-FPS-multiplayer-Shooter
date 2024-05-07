import mongoose from "mongoose";
mongoose
    .connect("mongodb://localhost/instagib")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
const playerSchema = new mongoose.Schema({
    gameId: { type: Number, required: true },
    name: { type: String, required: true },
    kills: { type: Number, required: true, default: 0 },
    deaths: { type: Number, required: true, default: 0 },
});
const lobbySchema = new mongoose.Schema({
    lobbyId: { type: String, required: true, unique: true },
    players: {
        type: [playerSchema],
        required: false,
        default: [],
    },
});
export const Lobby = mongoose.model("Lobby", lobbySchema);
