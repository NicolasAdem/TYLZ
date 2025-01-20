import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

interface VoiceInputProps {
  onTranscriptComplete: (transcript: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscriptComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // @ts-ignore - WebkitSpeechRecognition is not in TypeScript types
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onTranscriptComplete(finalTranscript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }
  }, [onTranscriptComplete]);

  const toggleRecording = () => {
    if (!recognition) return;
    
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  if (!recognition) return null;

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
      title={isRecording ? "Stop recording" : "Start recording"}
    >
      <Mic className={`w-5 h-5 ${isRecording ? "text-blue-500 animate-pulse" : ""}`} />
    </button>
  );
};

export default VoiceInput;