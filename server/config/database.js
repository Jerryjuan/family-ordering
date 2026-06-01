const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.sqlite');
let db = null;
let SQL = null;

// 确保数据目录存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 保存数据库到磁盘
function saveDatabase() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (error) {
    console.error('保存数据库失败:', error);
  }
}

// 初始化数据库
async function initDatabase() {
  SQL = await initSqlJs();

  // 如果已有数据库文件，加载它
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
    console.log('✅ 已加载现有数据库');
    return;
  }

  db = new SQL.Database();

  // 创建表
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      status INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      remark TEXT,
      total_price REAL NOT NULL,
      status INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      dish_id INTEGER,
      dish_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL
    )
  `);

  // 初始化测试数据
  initTestData();
  saveDatabase();

  console.log('✅ 数据库初始化完成');
}

// 初始化测试数据
function initTestData() {
  // 检查是否已有数据
  const result = db.exec('SELECT COUNT(*) as count FROM categories');
  if (result.length > 0 && result[0].values[0][0] > 0) return;

  // 插入分类
  db.run("INSERT INTO categories (name, icon, sort_order) VALUES ('热菜', '🍖', 1)");
  db.run("INSERT INTO categories (name, icon, sort_order) VALUES ('凉菜', '🥗', 2)");
  db.run("INSERT INTO categories (name, icon, sort_order) VALUES ('甜品', '🍰', 3)");
  db.run("INSERT INTO categories (name, icon, sort_order) VALUES ('饮品', '🥤', 4)");

  // 插入菜品 - 热菜 (category_id: 1)
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (1, '红烧肉', '肥而不腻，入口即化的经典家常菜', 38, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (1, '糖醋排骨', '酸甜可口，色泽红亮的招牌菜', 42, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (1, '宫保鸡丁', '麻辣鲜香，鸡肉嫩滑', 32, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (1, '红烧鱼块', '鲜嫩多汁，汤汁浓郁', 48, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (1, '土豆炖牛肉', '牛肉软烂，土豆入味', 45, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (1, '西红柿炒鸡蛋', '经典搭配，酸甜可口', 18, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (1, '青椒肉丝', '清爽下饭，肉丝滑嫩', 22, 1)");

  // 凉菜 (category_id: 2)
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (2, '凉拌黄瓜', '爽脆开胃，蒜香浓郁', 12, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (2, '拍黄瓜', '简单清爽，夏日必备', 10, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (2, '凉拌木耳', '爽口清脆，营养丰富', 15, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (2, '凉拌豆腐丝', '豆香浓郁，口感细腻', 14, 1)");

  // 甜品 (category_id: 3)
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (3, '芒果布丁', '芒果味浓，口感细腻', 18, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (3, '双皮奶', '奶香浓郁，入口即化', 16, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (3, '红豆沙', '甜而不腻，暖心暖胃', 12, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (3, '杨枝甘露', '芒果椰奶西米露', 22, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (3, '自制蛋糕', '松软香甜，用心烘焙', 25, 1)");

  // 饮品 (category_id: 4)
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (4, '冰镇酸梅汤', '酸甜解暑，传统风味', 8, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (4, '柠檬蜂蜜水', '清新解渴，美容养颜', 10, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (4, '自制奶茶', '香浓顺滑，独家配方', 15, 1)");
  db.run("INSERT INTO dishes (category_id, name, description, price, status) VALUES (4, '西瓜汁', '鲜榨西瓜，夏日清爽', 12, 1)");

  console.log('✅ 测试数据初始化完成');
}

// 获取数据库实例
function getDb() {
  return db;
}

// 执行查询并返回所有结果
function queryAll(sql, params = []) {
  if (!db) throw new Error('数据库未初始化');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  // 每次查询后保存
  saveDatabase();
  return results;
}

// 执行查询并返回单条结果
function queryOne(sql, params = []) {
  if (!db) throw new Error('数据库未初始化');
  const stmt = db.prepare(sql);
  stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  saveDatabase();
  return result;
}

// 执行写入操作
function run(sql, params = []) {
  if (!db) throw new Error('数据库未初始化');
  db.run(sql, params);
  saveDatabase();
  return {
    lastInsertRowid: getDb().exec('SELECT last_insert_rowid()')[0]?.values[0][0]
  };
}

module.exports = { initDatabase, getDb, queryAll, queryOne, run, saveDatabase };