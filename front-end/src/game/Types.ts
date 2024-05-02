export interface PlayerProp {
  gameId: number | null;
  name: string;
}

export interface LobbyStore {
  AddToLobby(player: PlayerProp): void;
  RemoveFromLobby(id: number): number;
  EmptyLobby(): void;
  Subscribe(listener: () => void): () => void;
  GetSnapShot(): PlayerProp[];
  ROOM: PlayerProp[];
}

export interface PauseStore {
  PAUSE: boolean;
  GetSnapShot(): boolean;
  Subscribe(listener: () => void): () => void;
  SetPause: (f: boolean) => void;
}

export interface Setting {
  control: {
    forward: string;
    back: string;
    left: string;
    right: string;
  };
  setting: {
    fov: number;
    sensitivty: number;
  };
}
export interface ServerError {
  error: string;
}
export interface LobbyResponse {
  lobbyId: string;
  players: PlayerProp[];
}
export interface CreateLobbyRequest {
  playerName: string;
}
export interface JoinLobbyRequest {
  lobbyId: string;
  playerName: string;
}
export interface LeaveLobbyRequest {
  lobbyId: string;
  playerName: string;
}
