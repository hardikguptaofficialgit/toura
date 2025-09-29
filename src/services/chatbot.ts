// Chatbot service for Toura backend
// Endpoints documented in backend.md and served by https://touraapis.up.railway.app/

export interface NewChatResponse {
  id: string;
  history: Array<{ type: 'system' | 'user' | 'assistant'; message: string; timestamp: string | number | null }>;
}

export interface AppendChatResponse extends NewChatResponse {}

const DEFAULT_BASE_URL = 'https://touraapis.up.railway.app';
const BASE_URL = (import.meta as any).env?.VITE_BACKEND_BASE_URL || DEFAULT_BASE_URL;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function startNewChat(message: string): Promise<NewChatResponse> {
  const res = await fetch(`${BASE_URL}/chatbot/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return handleResponse<NewChatResponse>(res);
}

export async function appendToChat(sessionId: string, message: string): Promise<AppendChatResponse> {
  const res = await fetch(`${BASE_URL}/chatbot/${encodeURIComponent(sessionId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return handleResponse<AppendChatResponse>(res);
} 