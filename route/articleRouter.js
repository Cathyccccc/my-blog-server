const express = require('express')
const router = express.Router()
const articleService = require('../service/article');

// middleware that is specific to this router
// router.use((req, res, next) => {
//   next()
// })
// define the home page route
router.get('/', async (req, res) => {
  const {page, pageSize, filterKey} = req.query;
  const result = await articleService.getArticles({page: ~~page, pageSize: ~~pageSize, filterKey});
  const total = await articleService.getAtriclesCount();
  res.send({
    code: 0,
    success: true,
    data: {
      list: result,
      total,
    }
  })
})
// define the about route
router.get('/:id', async (req, res) => {
  const {id} = req.params;
  const result = await articleService.getArticleById(id);
  res.send({
    code: 0,
    success: true,
    data: result
  })
})

router.post('/', async (req, res) => {
  const article = req.body;
  await articleService.addArticle(article);
  res.send({
    code: 0,
    success: true,
    data: {
      msg: '新增成功'
    }
  })
})

router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  await articleService.deleteArticle(id);
  res.send({
    code: 0,
    success: true,
    data: {
      msg: '删除成功'
    }
  })
})

router.put('/', async (req, res) => {
  const article = req.body;
  await articleService.updateArticle(article);
  res.send({
    code: 0,
    success: true,
    data: {
      msg: '更新成功'
    }
  })
})

module.exports = router