const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDatabase } = require('./config/database');

// 导入路由
const categoriesRouter = require('./routes/categories');
const dishesRouter = require('./routes/dishes');
const ordersRouter = require('./routes/orders');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 注册路由
app.use('/api/categories', categoriesRouter);
app.use('/api/dishes', dishesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/stats', statsRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务运行正常' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 异步启动服务
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 家常菜点餐服务已启动！`);
      console.log(`📍 地址: http://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ 服务启动失败:', error);
    process.exit(1);
  }
}

start();

module.exports = app;