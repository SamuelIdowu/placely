// src/domain/entities/message.ts
// Message entity — messaging context (ADR-02: polling, no WebSocket at MVP).

export interface MessageProps {
  id: string;
  applicationId: string;
  senderId: string;
  body: string;
  createdAt: Date;
}

export class Message {
  private readonly props: MessageProps;

  constructor(props: MessageProps) {
    if (!props.body.trim()) {
      throw new Error('Message body cannot be empty');
    }
    this.props = props;
  }

  get id() { return this.props.id; }
  get applicationId() { return this.props.applicationId; }
  get senderId() { return this.props.senderId; }
  get body() { return this.props.body; }
  get createdAt() { return this.props.createdAt; }

  toObject(): MessageProps {
    return { ...this.props };
  }
}
