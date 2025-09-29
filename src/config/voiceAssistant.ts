// Voice Assistant Configuration
export interface VoiceAssistantConfig {
  elevenLabs: {
    apiKey: string;
    voiceId: string;
    modelId: string;
    agentId?: string;
    voiceSettings: {
      stability: number;
      similarityBoost: number;
      style: number;
      useSpeakerBoost: boolean;
    };
  };
  speechRecognition: {
    language: string;
    continuous: boolean;
    interimResults: boolean;
  };
  ui: {
    defaultVolume: number;
    animationDuration: number;
    maxConversationLength: number;
  };
}

export const defaultVoiceAssistantConfig: VoiceAssistantConfig = {
  elevenLabs: {
    apiKey: import.meta.env.VITE_ELEVEN_LABS_API_KEY || '',
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam voice - professional and clear
    modelId: 'eleven_monolingual_v1',
    agentId: import.meta.env.VITE_ELEVENLABS_AGENT_ID || '',
    voiceSettings: {
      stability: 0.5,
      similarityBoost: 0.5,
      style: 0.0,
      useSpeakerBoost: true
    }
  },
  speechRecognition: {
    language: 'en-US',
    continuous: true,
    interimResults: true
  },
  ui: {
    defaultVolume: 0.8,
    animationDuration: 300,
    maxConversationLength: 50
  }
};

// Available ElevenLabs voices for different use cases
export const availableVoices = {
  professional: {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    description: 'Professional, clear voice suitable for travel guidance'
  },
  friendly: {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    description: 'Friendly, warm voice perfect for customer service'
  },
  authoritative: {
    id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    description: 'Authoritative voice for important announcements'
  },
  conversational: {
    id: 'AZnzlk1XvdvUeBnXmlld',
    name: 'Domi',
    description: 'Conversational voice for natural dialogue'
  }
};

// Voice settings presets
export const voicePresets = {
  travel_guide: {
    stability: 0.6,
    similarityBoost: 0.7,
    style: 0.2,
    useSpeakerBoost: true
  },
  customer_service: {
    stability: 0.5,
    similarityBoost: 0.5,
    style: 0.0,
    useSpeakerBoost: true
  },
  news_announcer: {
    stability: 0.8,
    similarityBoost: 0.3,
    style: 0.0,
    useSpeakerBoost: false
  }
};