
export interface MessagePart {
  text?: string;
  image?: string; // data URL for images
}

export interface Message {
  id: number;
  role: 'user' | 'model';
  parts: MessagePart[];
}
