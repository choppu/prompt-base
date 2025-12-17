export interface Prompt {
  id?: number
  remoteId: number
  name: string
  prompts: PromptVariant
  notes: string
  tags: string[]
  image: Uint8Array<ArrayBuffer>
}

export type PromptGroup = Map<string, Prompt[]>
export type PromptVariant = { [key: string]: string }
export type ActivePrompt = { state: 'pbase__active-prompt-container'; prompt: Prompt }
