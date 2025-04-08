const crypto = require('crypto');

const generateXVerify = (body, endpoint, apiKey) => {
  const baseString = body + endpoint + apiKey;
  const hash = crypto.createHash('sha256').update(baseString).digest('hex');
  return `${hash}###1`; // appending ###<keyIndex>
};

module.exports = generateXVerify;
