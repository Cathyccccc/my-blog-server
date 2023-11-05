// Asynchronous
const {
  randomBytes,
} = require('node:crypto');

randomBytes(16, (err, buf) => {
  if (err) throw err;
  console.log(buf)
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
