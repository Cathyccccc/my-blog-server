const multiparty = require("multiparty");

module.exports = function (req, res, next) {
  if (req.is("multipart/form-data")) {
    // 创建 multiparty 表单解析器（每个请求都要新建）
    const form = new multiparty.Form();
    // 解析请求
    form.parse(req, function (err, fields, files) {
      if (err) {
        return next(err);
      }
      // 将解析后的字段和文件附加到 req 对象上
      req.body = fields; // 字段
      req.files = files; // 文件
      next();
    });
  } else {
    // 如果不是 multipart/form-data 请求，则直接调用下一个中间件
    next();
  }
};
