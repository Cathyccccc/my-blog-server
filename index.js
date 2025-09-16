const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// 集成 winston 和 morgan 日志库
const winston = require("winston");
const morgan = require("morgan");
const fs = require("fs");
const { generateToken, verifyToken } = require("./utils/token");
const articleRouter = require("./route/articleRouter");
const tagRouter = require("./route/tagRouter");
const projectRouter = require("./route/projectRouter");
const uploadRouter = require("./route/uploadRouter");
const commentRouter = require("./route/commentRouter");
// require('./test')
const app = express();
const port = 3001;

const axios = require("axios"); // 用于预热请求

// 日志
if (!fs.existsSync("logs")) fs.mkdirSync("logs");
// 直接将打印日志生成到文件中
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: "logs/app.log" })],
});
const accessStream = fs.createWriteStream("logs/access.log", { flags: "a" });
app.use(morgan("combined", { stream: accessStream }));

// 全局请求日志中间件
app.use((req, res, next) => {
  const logMsg = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
  logger.info(logMsg);
  console.log(logMsg);
  next();
});

app.use("/", (req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "https://192.168.1.230:8088");
  // res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  ); // 处理put请求报错CORS:Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response
  if (req.method === "OPTIONS") {
    return res.end();
  }
  next();
});
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
// app.use(bodyParser.raw({ type: 'multipart/form-data' })) // 解析二进制数据，如上传的图片

// app.get('/', (req, res) => {
//   res.send('hello world')
// })

app.post("/login", (req, res) => {
  const { loginId, loginPwd } = req.body;
  if (loginId === "star" && loginPwd === "123123a") {
    const token = generateToken({ loginId, loginPwd });
    // 返回 Token 给客户端
    // res.set("Authorization", `Bearer ${token}`);
    // res.setHeader("authentication", token);
    // console.log(res.header);
    res.status(200).json({ success: true, message: "登录成功", token: token });
  } else {
    res.status(401).json({ success: false, message: "用户名或密码错误" });
  }
});

app.use("/article", articleRouter);
app.use("/tag", tagRouter);
app.use("/project", projectRouter);
app.use("/upload", uploadRouter);
app.use("/comment", commentRouter);

// ？？？错误捕获中间件，能否避免服务中断？？？

app.use(require("./route/errorMiddleware"));

app.listen(port, () => {
  const startMsg = `[${new Date().toISOString()}] 服务启动，监听端口: ${port}`;
  logger.info(startMsg);
  console.log(startMsg);
  // 服务预热，主动请求一次/article接口
  axios
    .get(`http://localhost:${port}/article`)
    .then(() => {
      logger.info(`[${new Date().toISOString()}] 预热请求 /article 成功`);
      console.log(`[${new Date().toISOString()}] 预热请求 /article 成功`);
    })
    .catch((err) => {
      logger.error(
        `[${new Date().toISOString()}] 预热请求 /article 失败: ${err}`
      );
      console.error(
        `[${new Date().toISOString()}] 预热请求 /article 失败`,
        err
      );
    });
});
