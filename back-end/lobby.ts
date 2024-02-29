export interface Player {
  name: string;
  id: number;
}

export class Lobby {
  public id: string;
  public Players: Player[];
  constructor() {
    this.id = this.generateUniqueId();
    this.Players = [];
  }
  private generateUniqueId(): string {
    //need to change this
    const uniqueId = Math.random().toString(36).substr(2, 9);
    return uniqueId;
  }
  getPlayerById(playerName: string): Player | undefined {
    return this.Players.find((player) => player.name === playerName);
  }
}
