import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  user_id: z.number().int().positive().optional(), // For user-specific context
});

export type Chat = z.infer<typeof chatSchema>;


// npm install pdf-parse

// npm install tesseract.js

// npm install fluent-ffmpeg

// npm install node-vosk

// npm install @google-cloud/text-to-speech

// npm install simple-peer

// npm install node-fetch

// npm install ffmpeg-static


// https://www.youtube.com/watch?v=5rsKrTh3fAo&list=PPSV&%20t=248s