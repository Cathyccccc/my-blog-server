const express = require('express')
const fs = require('fs');
const path = require('path');
const multer = require('multer')
const router = express.Router();

const date = new Date();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const basePath = path.join(__dirname, '../public');
    let destination = `${basePath}/images/${year}/${month}`;
    fs.mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${hours}${minutes}${seconds}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueSuffix)
  }
})

const upload = multer({ storage });

router.post('/', upload.single('coverImg'), (req, res) => {
  const pathArr = req.file.destination.split('public/');
  const path = pathArr[1] + '/' + req.file.filename;
  res.send({
    code: 0,
    success: true,
    data: {
      msg: '文件上传成功',
      path,
    }
  })
})

module.exports = router;