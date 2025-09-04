const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const router = express.Router();
const fse = require("fs-extra");

const UPLOAD_DIR = "./public/files";
const date = new Date();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const basePath = path.join(__dirname, "../public");
    let destination = `${basePath}/images/${year}/${month}`;
    fs.mkdirSync(destination, { recursive: true });
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${hours}${minutes}${seconds}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    {
      name: "coverImg",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  (req, res) => {
    let file = null;
    if (req.files["coverImg"]) {
      file = req.files.coverImg[0];
    } else if (req.files["image"]) {
      file = req.files.image[0];
    }
    const pathArr = file.destination.split("public/");
    const path = "/static/" + pathArr[1] + "/" + file.filename;
    console.log(req.path);
    res.send({
      code: 0,
      success: true,
      message: "文件上传成功",
      data: {
        path,
      },
    });
  }
);

router.post("/file", async (req, res) => {
  const [chunk] = req.files.chunk;
  const [hash] = req.body.hash;
  const [filename] = req.body.filename;
  // 创建临时文件夹存储切片
  const chunkDir = path.resolve(UPLOAD_DIR, "chunkDir" + filename);
  if (!fse.pathExistsSync(chunkDir)) {
    await fse.mkdirs(chunkDir);
  }
  if (fse.pathExistsSync(`${chunkDir}/${hash}`)) {
    res.send({ code: 0, message: "切片已存在" });
    return;
  } // 防止重复上传切片
  await fse.move(chunk.path, `${chunkDir}/${hash}`);
  res.send({ code: 0, success: true, message: "切片上传成功", data: { hash } });
});

router.post("/merge", async (req, res) => {
  const { filename, size } = req.body.data;
  const chunkDir = path.resolve(UPLOAD_DIR, "chunkDir" + filename);
  const chunkPaths = await fse.readdir(chunkDir);
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
  const filePath = path.resolve(UPLOAD_DIR, `${filename}`);
  const data = await resolvePost(req);
  await Promise.all(
    chunkPaths.map((cPath, index) => {
      pipeStream(
        path.resolve(chunkDir, cPath),
        fs.createReadStream(filePath, { start: index * size })
      );
    })
  );
  fse.rmdirSync(chunkDir);
  res.send({ code: 0, success: true, message: "文件合并成功" });
});

const resolvePost = (req) => {
  return new Promise((resolve) => {
    let chunk = "";
    req.on("data", (data) => {
      console.log("可读流数据", data);
      chunk += data;
    });
    req.on("end", () => {
      resolve(JSON.parse(chunk));
    });
  });
};

const pipeStream = (path, writeStream) =>
  new Promise((resolve) => {
    const readStream = fse.createReadStream(path);
    readStream.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });

module.exports = router;
