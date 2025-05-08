const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY || '12345678901234567890123456789012'; // 32 bytes (256-bit key)

function encrypt(text) {
    const iv = crypto.randomBytes(16); // Sinh IV ngẫu nhiên
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Gắn IV vào trước bản mã hóa, để giải mã sau này
    const encryptedWithIv = iv.toString('hex') + ':' + encrypted;
    return encryptedWithIv;
}

function decrypt(encryptedText) {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = { encrypt, decrypt };
