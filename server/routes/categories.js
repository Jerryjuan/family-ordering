const { queryAll, queryOne, run } = require('../config/database');

const router = require('express').Router();

// 获取分类列表
router.get('/', (req, res) => {
  try {
    const categories = queryAll('SELECT * FROM categories ORDER BY sort_order ASC');
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '获取分类失败' });
  }
});

// 获取单个分类
router.get('/:id', (req, res) => {
  try {
    const category = queryOne('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!category) {
      return res.status(404).json({ success: false, error: '分类不存在' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '获取分类失败' });
  }
});

// 新增分类
router.post('/', (req, res) => {
  try {
    const { name, icon, sort_order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: '分类名称必填' });
    }
    const result = run('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)', [name, icon || '', sort_order || 0]);
    res.json({ success: true, data: { id: result.lastInsertRowid, name, icon, sort_order } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '新增分类失败' });
  }
});

// 更新分类
router.put('/:id', (req, res) => {
  try {
    const { name, icon, sort_order } = req.body;
    const category = queryOne('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!category) {
      return res.status(404).json({ success: false, error: '分类不存在' });
    }
    run('UPDATE categories SET name = ?, icon = ?, sort_order = ? WHERE id = ?',
      [name || category.name, icon !== undefined ? icon : category.icon, sort_order !== undefined ? sort_order : category.sort_order, req.params.id]);
    res.json({ success: true, data: { id: Number(req.params.id), name, icon, sort_order } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '更新分类失败' });
  }
});

// 删除分类
router.delete('/:id', (req, res) => {
  try {
    const category = queryOne('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!category) {
      return res.status(404).json({ success: false, error: '分类不存在' });
    }
    run('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '删除分类失败' });
  }
});

module.exports = router;