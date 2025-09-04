const jwt = require("jsonwebtoken");

// 定义密钥（生产环境中应存储在环境变量中）
const SECRET_KEY = "your-secret-key";

// 用户登录时生成 JWT
module.exports.generateToken = function (user) {
  // 定义 Payload（有效载荷）
  const payload = {
    id: user.loginId, // 用户 ID
    username: user.loginPwd, // 用户名
    // role: user.role, // 用户角色（可选）
  };

  // 签名生成 Token
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1 day", // 设置过期时间（1天）
  });

  return token;
};

module.exports.verifyToken = function (token) {
  try {
    // 验证 Token
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // 返回解码后的数据
  } catch (error) {
    console.error("Token verification failed:", error);
    return null; // 验证失败返回 null
  }
};
