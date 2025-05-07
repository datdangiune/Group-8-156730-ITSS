// utils/encryption.js
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY || '12345678901234567890123456789012'; // 32 ký tự
const iv = process.env.IV || '1234567890123456'; // 16 ký tự

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text.toString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
