export type AIProvider = 'anthropic' | 'google' | 'xai' | 'openai';

export interface AIProviderConfig {
  id: AIProvider;
  label: string;
  placeholder: string;
  icon: string;
  model: string;
  testPrompt?: string;
}

export const AI_PROVIDERS: AIProviderConfig[] = [
  { id: 'anthropic', label: 'Claude (Anthropic)', placeholder: 'sk-ant-...', icon: '🟣', model: 'claude-sonnet-4-20250514' },
  { id: 'google',    label: 'Gemini (Google)',     placeholder: 'AIza...', icon: '🔵', model: 'gemini-2.0-flash' },
  { id: 'openai',    label: 'ChatGPT (OpenAI)',    placeholder: 'sk-...', icon: '🟢', model: 'gpt-4o-mini' },
  { id: 'xai',       label: 'Grok (xAI)',          placeholder: 'xai-...', icon: '⚫', model: 'grok-3-mini' },
];
