// src/domain/value-objects/message.ts
import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z
    .string()
    .min(1, 'Message body cannot be empty')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
