/* eslint-disable @typescript-eslint/no-explicit-any */
const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0xa, 0x1a, 0x0a]
const JPEG_SOI_MARKER = [0xff, 0xd8]
const UNICODE_STRING = [0x55, 0x4e, 0x49, 0x43, 0x4f, 0x44, 0x45, 0x00]

export type GenerationParams = {
  seed?: number
  sampler?: string
  scheduler?: string
  model?: string
  steps?: number
  cfg?: number
  clip_skip?: number
  positive_prompt?: string
  negative_prompt?: string
}

enum HeaderType {
  PNG,
  JPEG,
}

export default class IMGMetadata {
  static load = (data: Uint8Array) => new IMGMetadata(data)
  
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
    const fileType = this.readHeader()
    
    this.text = {}
    
    if (fileType == HeaderType.PNG) {
      this.readPNG()
    } else {
      this.readJPEG()
    }
  }

  private readHeader = (): HeaderType => {
    try {
      this.readPNGHeader()
      return HeaderType.PNG
    } catch {}

    this.pos = 0

    try {
      this.readJPEGHeader()
      return HeaderType.JPEG
    } catch {}

    throw new Error('The file is neither a PNG nor a JPEG')
  }

  private readPNGHeader = () => {
    for (let i = 0; i < PNG_HEADER.length; i++) {
      if (PNG_HEADER[i] != this.data[this.pos++]) {
        throw new Error('Not a PNG file')
      }
    }
  }

  private readPNG = () => {
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

  private readJPEGHeader = () => {
    if (this.data[0] !== JPEG_SOI_MARKER[0] || this.data[1] !== JPEG_SOI_MARKER[1]) {
      throw new Error('Not a JPEG file')
    }

    this.pos = 2
  }
  
  private readJPEG = () => {
    while (this.pos < this.data.length - 1) {
      const marker = this.data[this.pos]
      if (marker !== 0xff) {
        break;
      }
      
      const segmentType = this.data[this.pos + 1]
      this.pos += 2
      
      const segmentLen = this.readUInt16() - 2

      switch (segmentType) {
        case 0xc0: // SOF0 (Start of Frame 0)
          this.pos++
          this.height = this.readUInt16()
          this.width = this.readUInt16()
          this.pos += (segmentLen - 5)
          break      
        case 0xe1: // APP1
          const app1 = this.read(segmentLen)
          this.parseAPP1(app1)
          break
        case 0xda: // Image data beings  
        case 0xd9: // EOI (End of Image)
          this.data = Uint8Array.from([])
          return
        default:
          this.pos += segmentLen
          break
      }
    }

    throw new Error('Malformed JPEG file')
  }
  
  private parseAPP1 = (app1: Uint8Array) => {
    if (app1.length < 8) {
      return
    }

    const latin1Decoder = new TextDecoder('latin1')
    const identifier = latin1Decoder.decode(app1.slice(0, 6))

    if (identifier === 'Exif\0\0') {
      this.parseExif(app1.slice(6))
    }  
  }
  
  private parseExif = (exif: Uint8Array) => {
    let i: number
    while(((i = exif.indexOf(UNICODE_STRING[0]!)) != -1)) {
      if (exif.length < (i + UNICODE_STRING.length)) {
        return
      }

      let matches = true
      for (let j = 1; j < UNICODE_STRING.length; j++) {
        if (UNICODE_STRING[j] != exif[i + j]) {
          matches = false
          break;
        }
      }

      if (matches) {
        i += UNICODE_STRING.length
        break
      }
    }

    const utf16Decoder = new TextDecoder('utf-16be')
    this.text["parameters"] = utf16Decoder.decode(exif.slice(i))
  }  
  
  private read = (numBytes: number): Uint8Array => {
    const res = this.data.slice(this.pos, (this.pos + numBytes))
    this.pos += numBytes
    return res
  }

  private readUInt16 = (): number => {
    const b1 = this.data[this.pos++]! << 8
    const b2 = this.data[this.pos++]!
    return b1 | b2
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
  
  private readPromptInput = (node: any, nodes: any, candidateKeys: string[]): any => {
    if (this.isZeroingNode(node)) {
      return undefined
    }
    
    const inputs = node["inputs"]
    
    for (const key of candidateKeys) {
      if (typeof inputs[key] !== "undefined") {
        if (!Array.isArray(inputs[key])) {
          return inputs[key]
        } else {
          return this.readPromptInput(nodes[inputs[key][0]], nodes, candidateKeys)
        }
      }
    }
    
    return undefined
  }
  
  private isSampler = (node: any): boolean => {
    return (node["class_type"] == "KSampler") || (node["class_type"] == "KSamplerAdvanced") || (node["class_type"] == "SamplerCustom") || (node["class_type"] == "SamplerCustomAdvanced")
  }
  
  private parseComfyUIPrompt = (promptString: string | undefined, out: GenerationParams[]) => {
    const prompt = JSON.parse(promptString!)
    Object.values(prompt).forEach((node) => {
      if (this.isSampler(node)) {
        const params: GenerationParams = {}
        
        // this method of searching is prone to give false positives but maximizes the chances to extract metadata without handling all possible nodes explicitly
        params.model = this.readPromptInput(node, prompt, ["model", "model_name", "ckpt_name", "unet_name", "opt_model", "gguf_name", "text"])
        params.seed = this.readPromptInput(node, prompt, ["seed", "noise", "noise_seed", "value"])
        params.scheduler = this.readPromptInput(node, prompt, ["scheduler", "sigmas", "text", "value"])
        params.sampler = this.readPromptInput(node, prompt, ["sampler_name", "sampler", "text", "value"])
        params.steps = this.readPromptInput(node, prompt, ["steps", "sigmas", "value"])
        params.cfg = this.readPromptInput(node, prompt, ["cfg", "guider", "value"])
        params.positive_prompt = this.readPromptInput(node, prompt, ["positive", "guider", "prompt", "conditioning", "text", "populated_text"])
        params.negative_prompt = this.readPromptInput(node, prompt, ["negative", "guider", "prompt", "conditioning", "text", "populated_text"])
        
        if (params.negative_prompt == params.positive_prompt) {
          params.negative_prompt = ""
        }
        
        out.push(params)
      }
    })
  }
  
  private parseAutomatic1111Parameters = (parameterString: string, out: GenerationParams[]) => {
    const lines = parameterString.trim().split("\n")
    const lastLine = lines.pop() || ''
  
    let prompt = ""
    let negativePrompt = ""
  
    let doneWithPrompt = false

    if ((lastLine.match(/([A-Za-z0-9_][A-Za-z0-9_ ]*): ([^\n]+)/) || []).length < 3) {
      lines.push(lastLine)
    }
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith("Negative prompt:")) {
        doneWithPrompt = true
        const rest = trimmedLine.substring(16).trim();
        negativePrompt += (negativePrompt === "" ? "" : "\n") + rest
      } else if (doneWithPrompt) {
        negativePrompt += (negativePrompt === "" ? "" : "\n") + trimmedLine
      } else {
        prompt += (prompt === "" ? "" : "\n") + trimmedLine
      }
    }
    
    const params: GenerationParams = {}
    params.positive_prompt = prompt
    params.negative_prompt = negativePrompt
    
    const meta: any = {}
    
    const reParam = /([A-Za-z0-9_][A-Za-z0-9_ ]*): ([^,]+)/g
    let match;
    while ((match = reParam.exec(lastLine)) !== null) {
      if (match.length < 3) {
        return
      } 

      const k = match[1]!;
      let v = match[2]!;
      
      if (v.startsWith('"') && v.endsWith('"')) {
        v = decodeURIComponent(v.substring(1, v.length - 1));
      }
        
      meta[k.toLowerCase()] = v;
    }

    params.model = meta["model"]
    params.clip_skip = meta["clip skip"]
    params.seed = meta["seed"]
    params.sampler = meta["sampler"]
    params.scheduler = meta["schedule type"]
    params.steps = meta["steps"]
    params.cfg = meta["cfg scale"]
    
    out.push(params)
  }

  private parseSwarmUI = (parameterString: string, out: GenerationParams[]) => {
    const json = JSON.parse(parameterString)["sui_image_params"]
    
    const params: GenerationParams = {}
    params.positive_prompt = json["prompt"]
    params.negative_prompt = json["negativeprompt"]
    params.model = json["model"]
    params.seed = json["seed"]
    params.sampler = json["sampler"]
    params.scheduler = json["schedule"]
    params.steps = json["steps"]
    params.cfg = json["cfgscale"]
    out.push(params)
  }

  private parseParameters = (out: GenerationParams[]) => {
    const parameterString = this.text.parameters
    
    if (typeof parameterString === "undefined") {
      return
    }

    try {
      this.parseSwarmUI(parameterString, out)
      return
    } catch {}

    try {
      this.parseComfyUIPrompt(parameterString, out)
      return
    } catch {}

    try {
      this.parseAutomatic1111Parameters(parameterString, out)
      return
    } catch {}
  }

  public getGenerationParams = (): GenerationParams[] => {
    const res: GenerationParams[] = []
    
    this.parseParameters(res);

    try {
      this.parseComfyUIPrompt(this.text.prompt, res)
    } catch {}
    
    return res
  }
  
  public getWorkflow = (): string | undefined => {
    return this.text.workflow
  }
}