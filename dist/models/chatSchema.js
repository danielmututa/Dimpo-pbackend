"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSchema = void 0;
const zod_1 = require("zod");
exports.chatSchema = zod_1.z.object({
    message: zod_1.z.string().min(1, 'Message is required').max(1000, 'Message too long'),
    user_id: zod_1.z.number().int().positive().optional(), // For user-specific context
});
// npm install pdf-parse
// npm install tesseract.js
// npm install fluent-ffmpeg
// npm install node-vosk
// npm install @google-cloud/text-to-speech
// npm install simple-peer
// npm install node-fetch
// npm install ffmpeg-static
// https://www.youtube.com/watch?v=5rsKrTh3fAo&list=PPSV&%20t=248s
//# sourceMappingURL=chatSchema.js.map