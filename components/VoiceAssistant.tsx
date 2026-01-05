
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, encode, decodeAudioData } from '../services/geminiService';
import { ChatMessage, User } from '../types';

interface VoiceAssistantProps {
  user: User;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ user }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const inputTranscriptionRef = useRef('');
  const outputTranscriptionRef = useRef('');
  const isActiveRef = useRef(false);

  const stopSession = useCallback(() => {
    isActiveRef.current = false;
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    setIsActive(false);
    // Stop all playing audio
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
  }, []);

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (!outputAudioContextRef.current) {
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            isActiveRef.current = true;
            
            // Stream audio from microphone
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              if (!isActiveRef.current || !sessionRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmData = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionRef.current.sendRealtimeInput({ media: pcmData });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio output
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle Transcriptions
            if (message.serverContent?.inputTranscription) {
              inputTranscriptionRef.current += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              outputTranscriptionRef.current += message.serverContent.outputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const userText = inputTranscriptionRef.current;
              const modelText = outputTranscriptionRef.current;
              
              setMessages(prev => [
                ...prev, 
                { role: 'user', content: userText },
                { role: 'model', content: modelText }
              ]);
              
              inputTranscriptionRef.current = '';
              outputTranscriptionRef.current = '';
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Voice Error:', e);
            setError("Something went wrong with the connection.");
            stopSession();
          },
          onclose: () => {
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `You are a helpful, empathetic medical assistant named UHC Companion. 
                              The user's native language is ${user.language}. 
                              Speak simply. Explain medical terms clearly. 
                              If asked about emergency symptoms, advise seeking immediate medical help. 
                              Keep responses relatively short and friendly.`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setError("Could not access microphone or connect to AI.");
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex-grow overflow-y-auto p-2 space-y-4 mb-4">
        {messages.length === 0 && !isActive && (
          <div className="text-center py-12 px-6">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">I'm Listening</h3>
            <p className="text-slate-500">Tap the microphone and ask me anything about your health, prescriptions, or laboratory results.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {isActive && (
          <div className="flex justify-start">
            <div className="bg-white border border-blue-100 rounded-2xl px-4 py-3 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm border border-red-100">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-center items-center pb-4 pt-2">
        {!isActive ? (
          <button
            onClick={startSession}
            disabled={isConnecting}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all active:scale-95 ${
              isConnecting ? 'bg-slate-300' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isConnecting ? (
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="text-3xl mb-1">🎙️</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Start</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={stopSession}
            className="w-24 h-24 bg-red-500 text-white rounded-full flex flex-col items-center justify-center shadow-xl transition-all active:scale-95 hover:bg-red-600"
          >
            <span className="text-3xl mb-1">⏹️</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Stop</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
