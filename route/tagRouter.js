const express = require("express");
const router = express.Router();
const tagService = require("../service/tag");

router.get("/", async (req, res) => {
  const result = await tagService.getTags();
  res.send({
    code: 0,
    success: true,
    data: result,
  });
});

router.post("/", async (req, res) => {
  const { tag_name } = req.body;
  await tagService.addTag(tag_name);
  res.send({
    code: 0,
    success: true,
    message: "新增成功",
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  // 需要先查询是否有文章的tag包含当前删除项，如果有，则不能删除
  const result = await tagService.getTagsInUse();
  if (result.indexOf(id) > -1) {
    // res.send({
    //   code: 0,
    //   success: false,
    //   data: {
    //     message: ''
    //   }
    // })
    res.status(200).json({ success: false, message: "标签已被文章使用" });
    return;
  }
  await tagService.deleteTag(id);
  res.send({
    code: 0,
    success: true,
    message: "删除成功",
  });
});

module.exports = router;
