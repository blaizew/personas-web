export interface Persona {
  slug: string;
  name: string;
  domain: string;
  description: string;
  portrait?: string;
  modules: string[];
}

export interface InviteLink {
  id: string;
  token: string;
  user_name: string;
  token_budget: number;
  tokens_used: number;
  is_active: boolean;
  created_at: string;
}

export interface UsageLogEntry {
  id: string;
  invite_id: string;
  persona_slug: string;
  input_tokens: number;
  output_tokens: number;
  created_at: string;
}

export interface PersonaUsageBreakdown {
  persona_slug: string;
  total_input: number;
  total_output: number;
  call_count: number;
}
