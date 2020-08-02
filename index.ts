import { mnemonicValidate } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { KeypairType } from '@polkadot/util-crypto/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import axios from 'axios';
import yargs from 'yargs';

// Load all the possible words from BIP39 
// Copied from https://github.com/iancoleman/bip39/blob/master/src/js/wordlist_english.js
import wordlist from './wordlist';

let PARITY_API_URL = 'https://explorer-31.polkascan.io/polkadot/api/v1/account/';

async function bruteforceMnemonic(mnemonic: string, wordsToBrute: Array <number> ): Promise<void> {
  // Split mnemonic into its words
  let mnemonicParts = mnemonic.split(" ")

  for (let wordIndex = 0; wordIndex < wordsToBrute.length; wordIndex++) {
    let wordPosition = wordsToBrute[wordIndex];
    for (let i = 0; i < wordlist.length; i++) {
      mnemonicParts[wordPosition] = wordlist[i];
      let mnemonicTest = mnemonicParts.join(" ");

      if (mnemonicValidate(mnemonicTest)) {
        // Generate address to test if exists
        let address = addressFromMnemonic(mnemonicTest)

        // Test if account exists
        if (await checkExists(address)) {
          console.log("Found!")
          console.log('Address: ', address)
          console.log('Mnemonic: ', mnemonicTest)
          return
        }
      }
    }
  }

  console.log("Checked all possibilities.")

  return
}

async function checkExists(address: string): Promise<boolean> {
  try {
    console.log("Checking address", address)
    await axios.get(PARITY_API_URL + address)
  } catch (error) {
    return false
  }

  return true
}

function addressFromMnemonic(mnemonic: string, ss58Format ? : number, keyType ? : KeypairType): string {
  // Polkadot live format: 0 - Polkadot
  ss58Format = ss58Format ? ss58Format : 0
  // Key type, can be one of: 'ecdsa', 'ed25519', 'sr25519'
  keyType = keyType ? keyType : 'sr25519'

  // Create keyring setting default options
  let keyring = new Keyring({
    ss58Format: ss58Format,
    type: keyType
  })

  // Create keypair from mnemonic
  let keyringPair = keyring.addFromMnemonic(mnemonic)

  return keyringPair.address;
}

async function main(mnemonic: string, wordsToBrute: Array<number> ): Promise<void> {
  console.log('Waiting for crypto libs to be loaded ... ')
  await cryptoWaitReady()
  console.log('Done loading crypto libs')

  await bruteforceMnemonic(mnemonic, wordsToBrute)

  return
}

function showHelp() {
  console.log("Bruteforce a incorrect mnemonic.")
  console.log("Provide a mnemonic to brute force:")
  console.log('$ npm run brute -- --mnemonic="alpha XXX achieve iron alone lava high quick stairs talk vocal any"')
  console.log("The word XXX will be replaced and brute forced.")
}

function identifyBruteforcePosition(mnemonic: string): Array <number> {
  let mnemonicParts = mnemonic.split(" ")

  for (let i = 0; mnemonicParts.length; i++) {
    if (mnemonicParts[i] === 'XXX') {
      return [i]
    }
  }

  console.log('Could not find the word "XXX" in the provided mnemonic')
  console.log('Example:')
  console.log('$ npm run brute -- --mnemonic="alpha XXX achieve iron alone lava high quick stairs talk vocal any"')
  process.exit()
}

// HACK: Add a timeout because sometimes cryptoWaitReady() fails 🤦.
setTimeout(
  async () => {
    let mnemonic = yargs.argv.mnemonic

    if (mnemonic === undefined) {
      showHelp()
      process.exit()
    }

    await main(mnemonic, identifyBruteforcePosition(mnemonic))
    console.log('Finished.')
  },
  1000
)

// async function doNothing(): Promise<void> {
//   console.log("Doing nothing")
//   return
// }

// setTimeout(
//   async () => { 
//     await doNothing()
//   },
//   1
// )