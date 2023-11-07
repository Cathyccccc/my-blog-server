const express = require('express');
const router = express.Router();
const projectService = require('../service/project');

router.get('/', async (req, res) => {
  const {filterKey} = req.query;
  const data = await projectService.getProjects(filterKey);
  res.send({
    code: 0,
    success: true,
    data,
  })
})

router.post('/', async (req, res) => {
  const project = req.body;
  await projectService.addProject(project);
  res.send({
    code: 0,
    success: true,
    data: {
      msg: '新增成功'
    }
  })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await projectService.deleteProject(id);
  res.send({
    code: 0,
    success: true,
    data: {
      msg: '删除成功'
    }
  })
})

router.put('/', async (req, res) => {

  try {
    const project = req.body;
    await projectService.updateProject(project);
    res.json({
      code: 0,
      success: true,
      data: {
        msg: '更新成功'
      }
    })
  } catch (error) {
    res.send({
      code: 0,
      success: false,
      error,
    })
  }

})

module.exports = router;
