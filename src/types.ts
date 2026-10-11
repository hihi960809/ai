export interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  accentColor: string;
  personality: string;
}

export interface Message {
  id: string;
  characterId: string;
  sender: 'user' | 'character';
  text: string;
  timestamp: string;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';
