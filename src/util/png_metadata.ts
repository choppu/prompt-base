/* eslint-disable @typescript-eslint/no-explicit-any */
const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0xa, 0x1a, 0x0a]

type GenerationParams = {
  seed: number
  sampler: string
  scheduler: string
  steps: number
  cfg: number
  positive_prompt: string
  negative_prompt: string
}

export default class PNGMetadata {
  static load = (data: Uint8Array) => new PNGMetadata(data)

  width: number
  height: number
  text: { [key: string]: string }

  private data: Uint8Array
  private pos: number

  constructor(data: Uint8Array) {
    this.data = data
    this.pos = 0
    this.width = 0
    this.height = 0
    this.checkHeader()

    this.text = {}

    const utf8Decoder = new TextDecoder('utf-8')
    const latin1Decoder = new TextDecoder('latin1')

    while (true) {
      const chunkSize = this.readUInt32()
      const section = latin1Decoder.decode(this.data.slice(this.pos, this.pos + 4))
      this.pos += 4

      switch (section) {
        case 'IHDR': {
          this.width = this.readUInt32()
          this.height = this.readUInt32()
          this.pos += (chunkSize - 8)
          break
        }

        case 'tEXt': {
          const text = this.read(chunkSize)
          const index = text.indexOf(0)
          const key = latin1Decoder.decode(text.slice(0, index))
          this.text[key] = latin1Decoder.decode(text.slice(index + 1))
          break
        }

        case 'iTXt': {
          const text = this.read(chunkSize)
          const index = text.indexOf(0)
          const key = latin1Decoder.decode(text.slice(0, index))
          if (text[index + 1] == 0) { // we only support uncompressed
            this.text[key] = utf8Decoder.decode(text.slice(text.lastIndexOf(0, index) + 1))
          }
          break
        }

        case 'IEND': {
          // We don't need data anymore
          this.data = Uint8Array.from([])
          return
        }

        default: {
          // Unknown (or unimportant) section, skip it
          this.pos += chunkSize
        }
      }

      this.pos += 4 // Skip the CRC
      if (this.pos > this.data.length) {
        throw new Error('Incomplete or corrupt PNG file')
      }
    }
  }

  private checkHeader = () => {
    for (let i = 0; i < PNG_HEADER.length; i++) {
      if (PNG_HEADER[i] != this.data[this.pos++]) {
        throw new Error('Not a PNG file')
      }
    }
  }

  private read = (numBytes: number): Uint8Array => {
    const res = this.data.slice(this.pos, (this.pos + numBytes))
    this.pos += numBytes
    return res
  }

  private readUInt32 = (): number => {
    const b1 = this.data[this.pos++]! << 24
    const b2 = this.data[this.pos++]! << 16
    const b3 = this.data[this.pos++]! << 8
    const b4 = this.data[this.pos++]!
    return b1 | b2 | b3 | b4
  }

  private readPromptInput = (nodes: any, id: string, key: string, candidateSubkeys: string[], defValue: any): any => {
    const inputs = nodes[id]["inputs"]

    if (!Array.isArray(inputs[key])) {
      return inputs[key]
    }

    const pointedNodeId = inputs[key][0]
    const pointedNode = nodes[pointedNodeId]["inputs"]
    
    for (const subkey of candidateSubkeys) {
      if (typeof pointedNode[subkey] !== "undefined") {
        return this.readPromptInput(nodes, pointedNodeId, subkey, candidateSubkeys, defValue)
      }
    }

    return defValue
  }

  private isKSampler = (node: any): boolean => {
    return (node["class_type"] == "KSampler") || (node["class_type"] == "KSamplerAdvanced")
  }

  public getGenerationParams = (): GenerationParams[] => {
    const res: GenerationParams[] = []

    if (this.text.prompt === undefined) {
      return res
    }

    const prompt = JSON.parse(this.text.prompt)

    for (const key of Object.keys(prompt)) {
      if (this.isKSampler(prompt[key])) {
        const params: GenerationParams = {seed: 0, sampler: "", scheduler: "", steps: 0, cfg: 0, positive_prompt: "", negative_prompt: ""}

        params.seed = this.readPromptInput(prompt, key, "seed", ["seed", "noise_seed", "value"], 0)
        params.scheduler = this.readPromptInput(prompt, key, "scheduler", ["scheduler", "text", "value"], "")
        params.sampler = this.readPromptInput(prompt, key, "sampler_name", ["sampler_name", "sampler", "text", "value"], "")
        params.steps = this.readPromptInput(prompt, key, "steps", ["steps", "value"], 0)
        params.cfg = this.readPromptInput(prompt, key, "cfg", ["cfg", "value"], 0)
        params.positive_prompt = this.readPromptInput(prompt, key, "positive", ["text", "prompt", "conditioning"], "")
        params.negative_prompt = this.readPromptInput(prompt, key, "negative", ["text", "prompt", "conditioning"], "")

        res.push(params)
      }
    }

    return res
  }

  public getWorkflow = (): string | undefined => {
    return this.text.workflow
  }
}