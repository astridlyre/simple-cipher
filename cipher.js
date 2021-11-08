const crypto = require('crypto')
const {
  flip,
  subtract,
  reduce,
  fromCharCodes,
  len,
  partial,
  pipe,
  sum,
  toCharCodes,
  trunc,
  zip,
} = require('./utils')

function Cipher(key) {
  this.key = key ?? RandomKey.generate()
}

Cipher.encode = function encode(text, cipher) {
  return pipe(
    toCharCodes,
    partial(zip)(sum, toCharCodes(trunc(len(text), cipher.key))),
    fromCharCodes
  )(text)
}

Cipher.decode = function decode(text, cipher) {
  return pipe(
    toCharCodes,
    partial(zip)(
      (...args) => reduce(flip(subtract), 0, args),
      toCharCodes(trunc(len(text), cipher.key))
    ),
    fromCharCodes
  )(text)
}

Object.assign(Cipher.prototype, {
  encode(text) {
    return Cipher.encode(text, this)
  },
  decode(text) {
    return Cipher.decode(text, this)
  },
})

const RandomKey = (() => {
  const POOL_SIZE_MULTIPLIER = 128
  const alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'

  let pool, poolOffset

  function fillPool(bytes) {
    if (!pool || pool.length < bytes) {
      pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER)
      crypto.randomFillSync(pool)
      poolOffset = 0
    } else if (poolOffset + bytes > pool.length) {
      crypto.randomFillSync(pool)
      poolOffset = 0
    }
    poolOffset += bytes
  }

  return {
    generate(size = 512) {
      fillPool(size)
      let randomKey = ''
      for (let i = poolOffset - size; i < poolOffset; i++) {
        randomKey += alphabet[pool[i] & 63]
      }
      return randomKey
    },
  }
})()

module.exports = { Cipher, RandomKey }
