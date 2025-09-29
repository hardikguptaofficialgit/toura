// ElevenLabs TTS Service
export interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  modelId?: string;
  agentId?: string;
  voiceSettings?: {
    stability: number;
    similarityBoost: number;
    style?: number;
    useSpeakerBoost?: boolean;
  };
}

export class ElevenLabsService {
  private config: ElevenLabsConfig;
  private audioContext: AudioContext | null = null;
  private currentAudio: AudioBufferSourceNode | null = null;

  constructor(config: ElevenLabsConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw error;
    }
  }

  async synthesize(text: string): Promise<AudioBuffer> {
    if (!this.audioContext) {
      await this.initialize();
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: this.config.modelId || 'eleven_monolingual_v1',
          voice_settings: this.config.voiceSettings || {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    const audioData = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
    return audioBuffer;
  }

  async playAudio(audioBuffer: AudioBuffer, onEnd?: () => void): Promise<void> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized');
    }

    // Stop any currently playing audio
    this.stopAudio();

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    if (onEnd) {
      source.onended = onEnd;
    }

    this.currentAudio = source;
    source.start();
  }

  stopAudio(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.stop();
      } catch (error) {
        // Audio might already be stopped
        console.log('Audio already stopped');
      }
      this.currentAudio = null;
    }
  }

  async speakText(text: string, onEnd?: () => void): Promise<void> {
    try {
      const audioBuffer = await this.synthesize(text);
      await this.playAudio(audioBuffer, onEnd);
    } catch (error) {
      console.error('Error speaking text:', error);
      // Fallback to browser TTS
      this.fallbackSpeak(text, onEnd);
    }
  }

  private fallbackSpeak(text: string, onEnd?: () => void): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    if (onEnd) {
      utterance.onend = onEnd;
    }
    
    speechSynthesis.speak(utterance);
  }

  destroy(): void {
    this.stopAudio();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Default configuration
export const defaultElevenLabsConfig: ElevenLabsConfig = {
  apiKey: import.meta.env.VITE_ELEVEN_LABS_API_KEY || '',
  voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam voice
  modelId: 'eleven_monolingual_v1',
  agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID || '',
  voiceSettings: {
    stability: 0.5,
    similarityBoost: 0.5,
    style: 0.0,
    useSpeakerBoost: true
  }
};