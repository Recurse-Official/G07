
import { Cipher, algorithms, modes } from 'cryptography.hazmat.primitives.ciphers';
import { PBKDF2HMAC } from 'cryptography.hazmat.primitives.kdf.pbkdf2';
import { hashes } from 'cryptography.hazmat.primitives';
import { PKCS7 } from 'cryptography.hazmat.primitives.padding';
import { default_backend } from 'cryptography.hazmat.backends';
import os from 'os';
import base64 from 'base64';

// Function to derive a key using a password
function derive_key(password, salt) {
    const kdf = new PBKDF2HMAC({
        algorithm: hashes.SHA256(),
        length: 32,
        salt: salt,
        iterations: 100000,
        backend: default_backend()
    });
    return kdf.derive(password.encode());
}

// Function to encrypt data
function encrypt(data, password) {
    const salt = os.urandom(16);
    const key = derive_key(password, salt);
    const iv = os.urandom(16);
    const cipher = new Cipher(algorithms.AES(key), modes.CBC(iv), default_backend());
    const encryptor = cipher.encryptor();
    const padder = new PKCS7(algorithms.AES.block_size).padder();
    const padded_data = padder.update(data.encode()) + padder.finalize();
    const encrypted = encryptor.update(padded_data) + encryptor.finalize();
    return base64.b64encode(salt + iv + encrypted).decode();
}

// Function to decrypt data
function decrypt(encrypted_data, password) {
    const decoded_data = base64.b64decode(encrypted_data);
    const salt = decoded_data.slice(0, 16);
    const iv = decoded_data.slice(16, 32);
    const ciphertext = decoded_data.slice(32);
    const key = derive_key(password, salt);
    const cipher = new Cipher(algorithms.AES(key), modes.CBC(iv), default_backend());
    const decryptor = cipher.decryptor();
    const padded_data = decryptor.update(ciphertext) + decryptor.finalize();
    const unpadder = new PKCS7(algorithms.AES.block_size).unpadder();
    const data = unpadder.update(padded_data) + unpadder.finalize();
    return data.decode();
}