export type PlayerProp = {
  name: string;
  id: number | null;
};

export type LobbyStore = {
  AddToLobby(player: PlayerProp): void;
  RemoveFromLobby(id: number): number;
  EmptyLobby(): void;
  Subscribe(listener: () => void): () => void;
  GetSnapShot(): PlayerProp[];
  ROOM: PlayerProp[];
};

export type PauseStore = {
  PAUSE: boolean;
  GetSnapShot(): boolean;
  Subscribe(listener: () => void): () => void;
  SetPause: (f: boolean) => void;
};

export type Setting = {
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
};
