
import CryptoJS from "crypto-js";

const SECRET_KEY = "Gizli_Anahtar";

export const encryptMessage = (message: string) => {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
};

export const decryptMessage = (encryptedMessage: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
