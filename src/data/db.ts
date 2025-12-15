import type { Prompt, PromptGroup } from '../types/Prompt'
import { Dexie, type EntityTable } from 'dexie'

const DB_NAME = 'PromptBaseDB'

type PromtBaseDB = Dexie & { prompts: EntityTable<Prompt, 'id'> }

let glob_db: PromtBaseDB
let glob_tags: Set<string>

export const openDB = (): void => {
  glob_tags = new Set()
  glob_db = new Dexie(DB_NAME) as PromtBaseDB
  glob_db.version(1).stores({
    prompts: '++id, remoteId, name, *tags',
  })
}

export const getDB = (): Dexie => {
  return glob_db
}

export const addPrompt = async (prompt: Prompt): Promise<void> => {
  glob_db.prompts.add(prompt)
}

export const putPrompt = async (prompt: Prompt): Promise<void> => {
  glob_db.prompts.put(prompt)
}

export const removePrompt = async (toRemove: Prompt | number): Promise<void> => {
  glob_db.prompts.delete(typeof toRemove == "number" ? toRemove : toRemove.id)
}

const searchTag = (tag: string, searchString: string, sep: string = ":"): boolean => {
  for (let tagPart of tag.split(sep)) {
    if (tagPart.toLowerCase().startsWith(searchString.toLowerCase())) {
      return true;
    }
  }

  return false
}

const searchName = (name: string, searchString: string): boolean => {
  if (searchString.includes(" ")) {
    return name.toLowerCase().startsWith(searchString.toLowerCase())
  } else {
    return searchTag(name, searchString, " ")
  }
}

export const getPrompts = async (searchString?: string, filterTags?: string[]): Promise<PromptGroup> => {
  const res: PromptGroup = new Map()
  const groupPrompts = (prompt: Prompt) => {
    const tag = prompt.tags[0] as string
    prompt.tags.forEach((t) => glob_tags.add(t))
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

  const searchByTagsAndName = (prompt: Prompt): boolean => {
    if (!searchString) {
      return true
    }

    for (let tag of glob_tags) {
      if (searchTag(tag, searchString)) {
        if (prompt.tags.indexOf(tag) != -1) {
          return true
        }
      }
    }

    return searchName(prompt.name, searchString)
  }

  let query_res

  if (filterTags) {
    query_res = await glob_db.prompts.where('tags').anyOf(filterTags).distinct().filter(searchByTagsAndName).sortBy('tags')
  } else {
    query_res = await glob_db.prompts.orderBy('tags').filter(searchByTagsAndName).toArray()
  }

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
