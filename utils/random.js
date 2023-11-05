const crypto = require('crypto');

/**
 * 随机生成一个长度16的字符串
 */
function randomString(cb) {
  crypto.randomBytes(8, (err, raw) => {
    cb(err, err ? undefined : raw.toString('hex'));
  })
}


module.exports = {
  randomString
}