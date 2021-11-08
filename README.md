# Simple Cipher

A simple cipher program that uses a user-provided key, or a randomly generated
one to encrypt a text message provided on `stdin`.

## Usage

Encryption:

```sh
node ./simple-cipher.js < file-to-encrypt
```

Decryption:

```sh
node ./simple-cipher.js -d [KEY] < file-to-decrypt
```

