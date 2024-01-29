export interface ChatInfo {
	avatarReference: string;
	idChat: string;
	lastMessageDate: string;
	lastMessageText: string;
	name: string;
	notReadMessages: number;
	username: string;
}

export interface Chat {
  idChat: string,
  avatarReference: string,
  name: string,
  username: string,
  messages: ChatMessage[]
}

export interface ChatMessage {
  direction: ChatMessageDirection,
  data: {
    idMessage: string,
    idSender: string,
    text: string,
    registrationDate: string,
    idDomainStatusMessage: number,
    idChat: string
  }
}

export enum ChatMessageDirection {
  Outgoing = "outgoing",
  Incoming = "incoming"
};