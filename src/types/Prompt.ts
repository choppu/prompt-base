export interface Prompt {
  id?: number
  remoteId: number
  name: string
  naturalPrompt: string
  tagBasedPrompt: string
  tags: string[]
  image: Uint8Array<ArrayBuffer>
}

export type PromptGroup = Map<string, Prompt[]>
