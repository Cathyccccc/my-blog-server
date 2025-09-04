const express = require("express");
const router = express.Router();
const articleService = require("../service/article");

// middleware that is specific to this router
// router.use((req, res, next) => {
//   next()
// })
// define the home page route
router.get("/", async (req, res) => {
  const { page, pageSize, filterKey, isPublish } = req.query;
  let result = [];
  if (filterKey === "favor") {
    result = await articleService.getFavoriteArticles();
  } else if (isPublish == 1) {
    // 这里请求数字1会转为字符串1，需要做详细的判断（字符串为0时if(isPublish)返回true）
    result = await articleService.getPublishArticles({
      page: ~~page,
      pageSize: ~~pageSize,
      filterKey,
    });
  } else {
    result = await articleService.getArticles({
      page: ~~page,
      pageSize: ~~pageSize,
      filterKey,
    });
  }
  const total = await articleService.getArticlesCount();
  res.send({
    code: 0,
    success: true,
    data: {
      list: result,
      total,
    },
  });
});
// define the about route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await articleService.getArticleById(id);
  res.send({
    code: 0,
    success: true,
    data: result,
  });
});

router.post("/", async (req, res) => {
  const article = req.body;
  await articleService.addArticle(article);
  res.send({
    code: 0,
    success: true,
    message: "新增成功",
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await articleService.deleteArticle(id);
  res.send({
    code: 0,
    success: true,
    message: "删除成功",
  });
});

router.put("/", async (req, res) => {
  const article = req.body;
  await articleService.updateArticle(article);
  res.send({
    code: 0,
    success: true,
    message: "更新成功",
  });
});

module.exports = router;
