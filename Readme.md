## Polkadot Mnemonic Bruteforce

If you wrote your mnemonic incorrectly for [Polkadot](https://polkadot.network/) and cannot understand one word, you can use this tool to bruteforce through all the possible BIP39 words and find your original, correct mnemonic.

### Installation

You need to clone the repository.

```console
$ git clone https://github.com/cleanunicorn/polka-dot-mnemonic-brute.git
```

Install dependencies.

```console
$ npm i
```

### Run

You need to specify the mnemonic to bruteforce and instead of the incorrect word, you should put `XXX`.

For example:

```console
$ npm run brute -- --mnemonic="alpha XXX achieve iron alone lava high quick stairs talk vocal any"
```

In this example the word in the second position will be bruteforced. A request to the Polkadot blockchain explorer will be done to validate the address generated exists.

Good luck!
