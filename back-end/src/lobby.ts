export interface Player {
  gameId: number;
  name: string;
}

export interface LobbyResponse {
  lobbyId: string;
  players: Player[];
}
