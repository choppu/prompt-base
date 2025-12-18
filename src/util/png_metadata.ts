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

  private isZeroingNode = (node: any): boolean => {
    return node["class_type"] == "ConditioningZeroOut"
  }

  private readPromptInput = (node: any, nodes: any, candidateKeys: string[], defValue: any): any => {
    if (this.isZeroingNode(node)) {
      return defValue
    }

    const inputs = node["inputs"]
    
    for (const key of candidateKeys) {
      if (typeof inputs[key] !== "undefined") {
        if (!Array.isArray(inputs[key])) {
          return inputs[key]
        } else {
          return this.readPromptInput(nodes[inputs[key][0]], nodes, candidateKeys, defValue)
        }
      }
    }

    return defValue
  }

  private isSampler = (node: any): boolean => {
    return (node["class_type"] == "KSampler") || (node["class_type"] == "KSamplerAdvanced") || (node["class_type"] == "SamplerCustom") || (node["class_type"] == "SamplerCustomAdvanced")
  }

  public getGenerationParams = (): GenerationParams[] => {
    const res: GenerationParams[] = []

    if (this.text.prompt === undefined) {
      return res
    }

    const prompt = JSON.parse(this.text.prompt)
    Object.values(prompt).forEach((node) => {
      if (this.isSampler(node)) {
        const params: GenerationParams = {seed: 0, sampler: "", scheduler: "", steps: 0, cfg: 0, positive_prompt: "", negative_prompt: ""}

        // this method of searching is prone to give false positives but maximizes the chances to extract metadata without handling all possible nodes explicitly
        params.seed = this.readPromptInput(node, prompt, ["seed", "noise", "noise_seed", "value"], 0)
        params.scheduler = this.readPromptInput(node, prompt, ["scheduler", "sigmas", "text", "value"], "")
        params.sampler = this.readPromptInput(node, prompt, ["sampler_name", "sampler", "text", "value"], "")
        params.steps = this.readPromptInput(node, prompt, ["steps", "sigmas", "value"], 0)
        params.cfg = this.readPromptInput(node, prompt, ["cfg", "guider", "value"], 0)
        params.positive_prompt = this.readPromptInput(node, prompt, ["positive", "guider", "prompt", "conditioning", "text", "populated_text"], "")
        params.negative_prompt = this.readPromptInput(node, prompt, ["negative", "guider", "prompt", "conditioning", "text", "populated_text"], "")
        
        if (params.negative_prompt == params.positive_prompt) {
          params.negative_prompt = ""
        }

        res.push(params)
      }
    })

    return res
  }

  public getWorkflow = (): string | undefined => {
    return this.text.workflow
  }
}