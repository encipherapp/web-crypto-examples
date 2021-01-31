import {
  wrapKeyWithAesCbc256,
  KeyGenerator,
  KeyGeneratorMaps,
  Cipher,
  unwrapKeyWithAesCbc256,
} from '@encipher/web-crypto';

const algorithm: RsaHashedKeyGenParams = {
  name: KeyGeneratorMaps.rsaKeyGenerationAlgorithmsMap['RSA-OAEP'],
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: KeyGeneratorMaps.rsaKeyHashFunctionsMap['SHA-256'],
};

const keyGen = new KeyGenerator(algorithm);
let rsaKeyPair: CryptoKeyPair;

(keyGen.generateKey() as Promise<CryptoKeyPair>)
  .then(async (data) => {
    rsaKeyPair = data;
    const wrappedKey = await wrapKeyWithAesCbc256(
      'shirshendu',
      rsaKeyPair.privateKey,
    );
    console.log(wrappedKey);
    const unwrappedKey = await unwrapKeyWithAesCbc256('shirshendu', wrappedKey);

    console.log(rsaKeyPair.privateKey);
    console.log(unwrappedKey);

    const originalKey = await window.crypto.subtle.exportKey(
      'pkcs8',
      rsaKeyPair.privateKey,
    );
    const decryptedKey = await window.crypto.subtle.exportKey(
      'pkcs8',
      unwrappedKey,
    );

    console.log(originalKey);
    console.log(decryptedKey);

    const encryptionAlgorith: RsaOaepParams = {
      name: 'RSA-OAEP',
    };

    const cipher = new Cipher(
      encryptionAlgorith,
      rsaKeyPair.publicKey,
      rsaKeyPair.privateKey,
    );

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    console.log(rsaKeyPair.privateKey);

    const cipherText = await cipher.encrypt(encoder.encode('Hello World'));
    console.log(decoder.decode(cipherText));
    const plainText = await cipher.decrypt(cipherText, unwrappedKey);
    console.log(decoder.decode(plainText));
  })
  .catch((err) => {
    console.log(err);
  });
