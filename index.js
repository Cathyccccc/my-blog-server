const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const articleRouter = require('./route/articleRouter');
const tagRouter = require('./route/tagRouter');
const projectRouter = require('./route/projectRouter');
const uploadRouter = require('./route/uploadRouter');
const commentRouter = require('./route/commentRouter');
// require('./test')
const app = express();
const port = 3000;

app.use('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept'); // 处理put请求报错CORS:Request header field content-type is not allowed by Access-Control-Allow-Headers in preflight response
  if (req.method === 'OPTIONS') {
    return res.end();
  }
  next();
})
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(bodyParser.json({ limit: '100mb' }))
// app.use(bodyParser.raw({ type: 'multipart/form-data' })) // 解析二进制数据，如上传的图片

// app.get('/', (req, res) => {
//   res.send('hello world')
// })

app.post('/logon', (req, res) => {
  const {loginId, loginPwd} = req.body;
  if (loginId === 'star' && loginPwd === '123123a') {
    res.send({
      code: 0,
      success: true,
      data: {
        msg: '登录成功'
      }
    })
  } else {
    res.send({
      code: 0,
      success: false,
      data: {
        msg: '账户不存在'
      }
    })
  }
})

app.use('/article', articleRouter)
app.use('/tag', tagRouter);
app.use('/project', projectRouter);
app.use('/upload', uploadRouter);
app.use('/comment', commentRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

app.listen(port, () => {
  console.log('server is listening on 3000 port')
})

