const { Cipher, RandomKey } = require('../cipher')
const assert = require('assert/strict')

describe('Cipher', function () {
  let cipher
  beforeEach(() => {
    cipher = new Cipher()
  })
  describe('encoding text', function () {
    it('should encode text', function () {
      const actual = cipher.encode('hello')
      assert.notEqual(actual, 'hello')
    })

    it('should have a key, and key should not be revealed', function () {
      const actual = cipher.encode('aaaaaaaaaaa')
      assert.notEqual(actual, cipher.key.substring(0, actual.length))
    })

    it('should use a user provided key', function () {
      const actual = Cipher.encode('hello world', { key: 'abc' })
      assert.notEqual(actual, 'hello world')
    })
  })

  describe('decoding text', function () {
    it('should decode text', function () {
      const actual = cipher.encode('hello')
      const expected = cipher.decode(actual)
      assert.equal(expected, 'hello')
    })

    it('should decode with a key', function () {
      const actual = Cipher.encode('hello', { key: 'abc' })
      const expected = Cipher.decode(actual, { key: 'abc' })
      assert.equal(expected, actual)
    })
  })
})

describe('RandomKey', function () {
  describe('It should generate a random Key', function () {
    for (let i = 0; i < 10_000; i++) {
      const key1 = RandomKey.generate()
      const key2 = RandomKey.generate()
      const key3 = RandomKey.generate()
      assert.notEqual(key1, key2)
      assert.notEqual(key2, key3)
      assert.notEqual(key1, key3)
    }
  })
})
