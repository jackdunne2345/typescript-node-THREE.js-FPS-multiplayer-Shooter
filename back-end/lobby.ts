export interface Player {
  name: string;
  id: number;
}

export interface Lobby {
  id: string;
  players: Player[];
}
