// src/domain/entities/message.ts
// Message Domain Entity

export interface MessageProps {
  id: string;
  applicationId: string;
  senderId: string;
  senderRole?: string;
  body: string;
  createdAt: Date;
  sender?: {
    email?: string;
    name?: string;
    role?: string;
  };
}

export class Message {
  private readonly props: MessageProps;

  constructor(props: MessageProps) {
    if (!props.body || !props.body.trim()) {
      throw new Error('Message body cannot be empty');
    }
    this.props = {
      ...props,
      body: props.body.trim(),
    };
  }

  get id(): string {
    return this.props.id;
  }

  get applicationId(): string {
    return this.props.applicationId;
  }

  get senderId(): string {
    return this.props.senderId;
  }

  get senderRole(): string | undefined {
    return this.props.senderRole;
  }

  get body(): string {
    return this.props.body;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get sender(): MessageProps['sender'] {
    return this.props.sender;
  }

  isSentBy(userId: string): boolean {
    return this.props.senderId === userId;
  }

  toObject(): MessageProps {
    return { ...this.props };
  }
}
