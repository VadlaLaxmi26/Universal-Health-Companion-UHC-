
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const simplifyMedicalText = async (text: string, language: string = 'English'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Simplify the following medical text for a patient who might have low literacy levels. 
               Use simple, culturally sensitive analogies if helpful. 
               Output language: ${language}.
               
               Medical Text: ${text}`,
    config: {
      temperature: 0.7,
      systemInstruction: "You are a kind, empathetic health assistant for underserved communities. You simplify jargon into easy-to-understand language. Never give definitive clinical advice, always suggest seeing a doctor for serious concerns.",
    }
  });
  return response.text || "I'm sorry, I couldn't process that. Please try again.";
};

// Functions for Audio Encoding/Decoding for the Live API
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
