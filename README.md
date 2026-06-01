# 家常菜点餐小程序

> 为家人/对象做的专属点单小程序，温馨小厨房 🏠

## 项目结构

```
applet/
├── miniprogram/          # 微信小程序前端
│   ├── pages/            # 页面
│   │   ├── index/        # 首页菜单
│   │   ├── cart/         # 购物车
│   │   ├── order/        # 下单页
│   │   ├── order-list/   # 订单列表
│   │   ├── order-detail/ # 订单详情
│   │   ├── admin/        # 管理入口
│   │   ├── admin-dishes/ # 菜品管理
│   │   ├── admin-orders/ # 订单管理
│   │   └── admin-stats/  # 数据统计
│   ├── components/       # 公共组件
│   ├── utils/            # 工具函数
│   └── images/           # 图片资源
│
└── server/               # Node.js 后端
    ├── config/           # 数据库配置
    ├── routes/           # API 路由
    └── index.js          # 服务入口
```

## 快速开始

### 1. 启动后端服务

```bash
cd server
npm install
npm start
```

服务将在 http://localhost:3000 启动。

### 2. 导入小程序

1. 打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 选择「导入项目」
3. 目录选择 `miniprogram/`
4. AppID 可使用测试号或填入自己的 AppID
5. 点击确定导入

### 3. 配置服务器地址

在 `miniprogram/utils/config.js` 中修改 API 地址：

```javascript
// 本地开发
apiBaseUrl: 'http://localhost:3000/api'

// 生产环境（需 HTTPS）
apiBaseUrl: 'https://your-domain.com/api'
```

> ⚠️ 本地开发时，需在微信开发者工具中勾选「不校验合法域名」

## 功能说明

### 用户端
- 🍽️ 浏览菜单（按分类筛选）
- 🛒 购物车管理
- 📝 下单（填写姓名和备注）
- 📋 查看订单状态

### 管理端
- 🍽️ 菜品管理（增删改查、上下架）
- 📋 订单管理（查看、处理、取消）
- 📊 数据统计（营业额、热门菜品、趋势图）

## 预置菜品数据

| 分类 | 菜品 |
|------|------|
| 🍖 热菜 | 红烧肉、糖醋排骨、宫保鸡丁、红烧鱼块、土豆炖牛肉、西红柿炒鸡蛋、青椒肉丝 |
| 🥗 凉菜 | 凉拌黄瓜、拍黄瓜、凉拌木耳、凉拌豆腐丝 |
| 🍰 甜品 | 芒果布丁、双皮奶、红豆沙、杨枝甘露、自制蛋糕 |
| 🥤 饮品 | 冰镇酸梅汤、柠檬蜂蜜水、自制奶茶、西瓜汁 |

## 技术栈

- **前端**: 微信小程序原生开发
- **后端**: Node.js + Express
- **数据库**: SQLite (better-sqlite3)
- **样式**: WXSS + CSS 变量

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/categories | 获取分类列表 |
| GET/POST | /api/dishes | 获取/新增菜品 |
| PUT/DELETE | /api/dishes/:id | 更新/删除菜品 |
| GET/POST | /api/orders | 获取/创建订单 |
| PUT | /api/orders/:id/status | 更新订单状态 |
| GET | /api/stats/overview | 概览统计 |
| GET | /api/stats/popular | 热门菜品 |
| GET | /api/stats/trend | 趋势数据 |

## License

MIT