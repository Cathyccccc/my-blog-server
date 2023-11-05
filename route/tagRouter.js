const express = require('express');
const router = express.Router();
const tagService = require('../service/tag');

router.get('/', async (req, res) => {
  const result = await tagService.getTags();
  res.send({
    code: 0,
    success: true,
    data: result
  })
})

router.post('/', async (req, res) => {
  const {tag_name} = req.body;
  await tagService.addTag(tag_name);
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
  await tagService.deleteTag(id);
  res.send({
    code: 0,
    success: true,
    data: {
      msg: '删除成功'
    }
  })
})

module.exports = router;