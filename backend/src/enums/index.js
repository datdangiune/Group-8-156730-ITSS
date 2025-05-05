const ProductCode = require('./product-code.enum');

const UrlService = {
    sandbox: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
};

const HashAlgorithm = {
    SHA256: 'SHA256',
    SHA512: 'SHA512',
    MD5: 'MD5',
};

module.exports = {
    ProductCode,
    UrlService,
    HashAlgorithm,
};
