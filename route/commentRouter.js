const express = require("express");
const router = express.Router();
const commentService = require("../service/comment");

router.get("/", async (req, res) => {
  const result = await commentService.getComments();
  res.send({
    code: 0,
    success: true,
    data: result,
  });
});

router.post("/", async (req, res) => {
  const { articleId, commentId, comment, replyArr } = req.body;
  console.log(articleId, commentId, comment, replyArr);
  await commentService.addComment(articleId, commentId, comment, replyArr);
  res.send({
    code: 0,
    success: true,
    message: "新增评论成功",
  });
});

router.delete("/:articleId/:commentId", async (req, res) => {
  const { articleId, commentId } = req.params;
  await commentService.deleteComment(articleId, commentId);
  res.send({
    code: 0,
    success: true,
    message: "删除评论成功",
  });
});

module.exports = router;
