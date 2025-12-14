import * as DB from './db'

const REMOTE_DB_URL = '/db.json'
const PROMPTS_URL = '/db/'

export const run = async (): Promise<void> => {
  try {
    const resp = await fetch(REMOTE_DB_URL)
    const dbContext = await resp.json()

    for (let i = DB.getRemoteDBVersion(); i <= dbContext['version']; i++) {
      if (!dbContext['exclude'].includes(i)) {
        const resp = await fetch(PROMPTS_URL + i.toString().padStart(10, '0') + '.json')
        const prompt = await resp.json()

        const data = {
          remoteId: i,
          name: prompt['name'],
          naturalPrompt: prompt['prompt'],
          tagBasedPrompt: prompt['tag_prompt'] || '',
          tags: prompt['tags'],
          image: Uint8Array.from(atob(prompt['image']), (c) => c.charCodeAt(0)),
        }

        await DB.addPrompt(data).then(() => DB.setRemoteDBVersion(i + 1))
      }
    }
  } catch (err) {
    console.log(err)
  }
}
