export class Lobby {
    constructor() {
        this.id = this.generateUniqueId();
        this.Players = [];
    }
    generateUniqueId() {
        //need to change this
        const uniqueId = Math.random().toString(36).substr(2, 9);
        return uniqueId;
    }
    getPlayerById(playerName) {
        return this.Players.find((player) => player.name === playerName);
    }
}
