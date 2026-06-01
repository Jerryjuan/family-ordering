const { queryAll, queryOne, run } = require('../config/database');

const router = require('express').Router();

// 获取菜品列表（支持分类筛选）
router.get('/', (req, res) => {
  try {
    const { category_id, status } = req.query;
    let sql = 'SELECT d.*, c.name as category_name, c.icon as category_icon FROM dishes d LEFT JOIN categories c ON d.category_id = c.id WHERE 1=1';
    const params = [];

    if (category_id) {
      sql += ' AND d.category_id = ?';
      params.push(category_id);
    }
    if (status) {
      sql += ' AND d.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY d.sort_order ASC, d.id DESC';

    const dishes = queryAll(sql, params);
    res.json({ success: true, data: dishes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '获取菜品失败' });
  }
});

// 获取菜品详情
router.get('/:id', (req, res) => {
  try {
    const dish = queryOne('SELECT d.*, c.name as category_name FROM dishes d LEFT JOIN categories c ON d.category_id = c.id WHERE d.id = ?', [req.params.id]);
    if (!dish) {
      return res.status(404).json({ success: false, error: '菜品不存在' });
    }
    res.json({ success: true, data: dish });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '获取菜品失败' });
  }
});

// 新增菜品
router.post('/', (req, res) => {
  try {
    const { category_id, name, description, price, image, status, sort_order } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, error: '菜品名称和价格必填' });
    }
    const result = run(
      'INSERT INTO dishes (category_id, name, description, price, image, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category_id || null, name, description || '', price, image || '', status !== undefined ? status : 1, sort_order || 0]
    );
    res.json({ success: true, data: { id: result.lastInsertRowid, ...req.body } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '新增菜品失败' });
  }
});

// 更新菜品
router.put('/:id', (req, res) => {
  try {
    const { category_id, name, description, price, image, status, sort_order } = req.body;
    const dish = queryOne('SELECT * FROM dishes WHERE id = ?', [req.params.id]);
    if (!dish) {
      return res.status(404).json({ success: false, error: '菜品不存在' });
    }
    run(
      'UPDATE dishes SET category_id = ?, name = ?, description = ?, price = ?, image = ?, status = ?, sort_order = ? WHERE id = ?',
      [
        category_id !== undefined ? category_id : dish.category_id,
        name || dish.name,
        description !== undefined ? description : dish.description,
        price || dish.price,
        image !== undefined ? image : dish.image,
        status !== undefined ? status : dish.status,
        sort_order !== undefined ? sort_order : dish.sort_order,
        req.params.id
      ]
    );
    res.json({ success: true, data: { id: Number(req.params.id), ...req.body } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '更新菜品失败' });
  }
});

// 删除菜品
router.delete('/:id', (req, res) => {
  try {
    const dish = queryOne('SELECT * FROM dishes WHERE id = ?', [req.params.id]);
    if (!dish) {
      return res.status(404).json({ success: false, error: '菜品不存在' });
    }
    run('DELETE FROM dishes WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '删除菜品失败' });
  }
});

// 更新菜品状态（上架/下架）
router.put('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const dish = queryOne('SELECT * FROM dishes WHERE id = ?', [req.params.id]);
    if (!dish) {
      return res.status(404).json({ success: false, error: '菜品不存在' });
    }
    run('UPDATE dishes SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, data: { id: Number(req.params.id), status } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '更新状态失败' });
  }
});

module.exports = router;