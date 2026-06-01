const { queryOne, queryAll } = require('../config/database');

const router = require('express').Router();

// 获取概览统计
router.get('/overview', (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().slice(0, 10);

    const todayOrders = queryOne('SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = ?', [targetDate]);
    const todayRevenue = queryOne('SELECT SUM(total_price) as total FROM orders WHERE DATE(created_at) = ? AND status != 3', [targetDate]);
    const pendingOrders = queryOne('SELECT COUNT(*) as count FROM orders WHERE status = 0');
    const processingOrders = queryOne('SELECT COUNT(*) as count FROM orders WHERE status = 1');
    const dishCount = queryOne('SELECT COUNT(*) as count FROM dishes WHERE status = 1');

    res.json({
      success: true,
      data: {
        date: targetDate,
        todayOrders: todayOrders?.count || 0,
        todayRevenue: todayRevenue?.total || 0,
        pendingOrders: pendingOrders?.count || 0,
        processingOrders: processingOrders?.count || 0,
        dishCount: dishCount?.count || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '获取统计失败' });
  }
});

// 获取热门菜品排行
router.get('/popular', (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    const startDateStr = startDate.toISOString().slice(0, 10);

    const popularDishes = queryAll(`
      SELECT oi.dish_name, oi.dish_id, SUM(oi.quantity) as total_quantity, SUM(oi.quantity * oi.price) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE DATE(o.created_at) >= ? AND o.status != 3
      GROUP BY oi.dish_id, oi.dish_name
      ORDER BY total_quantity DESC
      LIMIT ?
    `, [startDateStr, parseInt(limit)]);

    res.json({
      success: true,
      data: popularDishes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '获取热门菜品失败' });
  }
});

// 获取近7天趋势
router.get('/trend', (req, res) => {
  try {
    const { days = 7 } = req.query;
    const trendData = [];

    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);

      const dayOrders = queryOne('SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = ?', [dateStr]);
      const dayRevenue = queryOne('SELECT SUM(total_price) as total FROM orders WHERE DATE(created_at) = ? AND status != 3', [dateStr]);

      trendData.push({
        date: dateStr,
        orders: dayOrders?.count || 0,
        revenue: dayRevenue?.total || 0
      });
    }

    res.json({
      success: true,
      data: trendData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: '获取趋势失败' });
  }
});

module.exports = router;