import type { Prompt, PromptGroup } from '../types/Prompt'
import { Dexie, type EntityTable } from 'dexie'

const DB_NAME = 'PromptBaseDB'

let glob_db: Dexie & { prompts: EntityTable<Prompt, 'id'> }

export const openDB = (): void => {
  glob_db = new Dexie(DB_NAME) as Dexie & {
    prompts: EntityTable<Prompt, 'id'>
  }

  glob_db.version(1).stores({
    prompts: '++id, remoteId, name, naturalPrompt, tagBasedPrompt, *tags',
  })
}

export const getDB = (): Dexie => {
  return glob_db
}

export const addPrompt = async (prompt: Prompt): Promise<void> => {
  glob_db.prompts.add(prompt)
}

export const getPrompts = async (filter?: string): Promise<PromptGroup> => {
  const res: PromptGroup = new Map()
  const groupPrompts = (prompt: Prompt) => {
    const tag = prompt.tags[0] as string

    if (res.has(tag)) {
      const arr = res.get(tag)!

      for (let i = 0; i < arr.length; i++) {
        if (prompt.name <= arr[i]!.name) {
          arr.splice(i, 0, prompt)
          return;
        }
      }

      arr.push(prompt)
    } else {
      res.set(tag, [prompt])
    }
  }

  const query_res = filter
    ? await glob_db.prompts.where('name').startsWithIgnoreCase(filter).sortBy('tags')
    : await glob_db.prompts.orderBy('tags').toArray()

  query_res.forEach(groupPrompts)
  return res
}

export const purgeOutdated = async (ids: number[]): Promise<void> => {
  glob_db.prompts.where("remoteId").anyOf(ids).delete()
}

export const setRemoteDBVersion = (version: number): void => {
  localStorage.setItem('remote-db-version', version.toString())
}

export const getRemoteDBVersion = (): number => {
  return Number(localStorage.getItem('remote-db-version')) || 1
}
