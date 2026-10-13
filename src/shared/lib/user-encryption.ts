export type EncryptedUserPayload = {
  _type: "encryptedUserPayload";
  version: 1;
  iv: string;
  ciphertext: string;
  tag: string;
};
