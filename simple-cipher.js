const { Transform } = require('stream')
const { pipeline } = require('stream/promises')
const { len } = require('./utils')
const { Cipher } = require('./cipher')

class EncodeCipherTransform extends Transform {
  constructor(key) {
    super()
    this.cipher = new Cipher(key)
    this.stringBuffer = ''
    if (!key) {
      console.error('KEY:')
    } else {
      console.error('ENCRYPTING WITH KEY:')
    }
    console.error(this.cipher.key, '\n')
    console.error('BEGIN ENCRYPTED MESSAGE:')
  }
  _transform(chunk, _, callback) {
    const str = chunk.toString()
    for (const char of str) {
      this.stringBuffer += char
      if (len(this.stringBuffer) === len(this.cipher.key)) {
        this.push(Buffer.from(this.cipher.encode(this.stringBuffer)))
        this.stringBuffer = ''
      }
    }
    callback()
  }
  _flush(callback) {
    if (len(this.stringBuffer)) {
      this.push(Buffer.from(this.cipher.encode(this.stringBuffer)))
    }
    callback()
  }
}

class DecodeCipherTransform extends Transform {
  constructor(key) {
    super()
    this.cipher = new Cipher(key)
    this.stringBuffer = ''
    console.error('DECRYPTING WITH KEY:')
    console.error(this.cipher.key, '\n')
    console.log('BEGIN DECRYPTED MESSAGE:')
  }
  _transform(chunk, _, callback) {
    const str = chunk.toString()
    for (const char of str) {
      this.stringBuffer += char
      if (len(this.stringBuffer) === len(this.cipher.key)) {
        this.push(Buffer.from(this.cipher.decode(this.stringBuffer)))
        this.stringBuffer = ''
      }
    }
    callback()
  }
  _flush(callback) {
    if (len(this.stringBuffer)) {
      this.push(Buffer.from(this.cipher.decode(this.stringBuffer)))
    }
    callback()
  }
}

class CipherTransform {
  static with(key, decode) {
    if (decode) {
      return new DecodeCipherTransform(key)
    }
    return new EncodeCipherTransform(key)
  }
}

const ARGS = process.argv.slice(2)
const DECODE = ARGS.includes('-d')
const KEY = ARGS.length === 1 ? ARGS[0] : ARGS[1]

;(async function main() {
  try {
    await pipeline(process.stdin, CipherTransform.with(KEY, DECODE), process.stdout)
  } catch (err) {
    console.error(err)
  }
})()
