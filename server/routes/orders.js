const { queryAll, queryOne, run } = require('../config/database');

const router = require('express').Router();

// 生成订单号
function generateOrderNo() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0') + now.getSeconds().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${date}${time}${random}`;
}

// 获取订单列表
router.get('/', (req, res) => {
  try {
    const { status, customer_name, date } = req.query;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (customer_name) {
      sql += ' AND customer_name LIKE ?';
      params.push(`%${customer_name}%`);
    }
    if (date) {
      sql += ' AND DATE(created_at) = ?';
      params.push(date);
    }
    sql += ' ORDER BY created_at DESC';

    const orders = queryAll(sql, params);

    // 获取每个订单的订单项
    for (const order of orders) {
      order.items = queryAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    }

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '获取订单失败' });
  }
});

// 获取订单详情
router.get('/:id', (req, res) => {
  try {
    const order = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) {
      return res.status(404).json({ success: false, error: '订单不存在' });
    }
    order.items = queryAll('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '获取订单失败' });
  }
});

// 创建订单
router.post('/', (req, res) => {
  try {
    const { customer_name, remark, items } = req.body;
    if (!customer_name || !items || items.length === 0) {
      return res.status(400).json({ success: false, error: '点餐人和菜品必填' });
    }

    const order_no = generateOrderNo();
    const total_price = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 插入订单
    const orderResult = run(
      'INSERT INTO orders (order_no, customer_name, remark, total_price, status) VALUES (?, ?, ?, ?, 0)',
      [order_no, customer_name, remark || '', total_price]
    );

    const order_id = orderResult.lastInsertRowid;

    // 插入订单项
    for (const item of items) {
      run('INSERT INTO order_items (order_id, dish_id, dish_name, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [order_id, item.dish_id, item.dish_name, item.price, item.quantity]);
    }

    res.json({
      success: true,
      data: {
        id: order_id,
        order_no,
        customer_name,
        remark,
        total_price,
        status: 0,
        items
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '创建订单失败' });
  }
});

// 更新订单状态
router.put('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [0, 1, 2, 3];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: '无效的状态值' });
    }

    const order = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) {
      return res.status(404).json({ success: false, error: '订单不存在' });
    }

    run('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, data: { id: Number(req.params.id), status } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '更新状态失败' });
  }
});

// 删除订单
router.delete('/:id', (req, res) => {
  try {
    const order = queryOne('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) {
      return res.status(404).json({ success: false, error: '订单不存在' });
    }
    run('DELETE FROM order_items WHERE order_id = ?', [req.params.id]);
    run('DELETE FROM orders WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '删除订单失败' });
  }
});

module.exports = router;