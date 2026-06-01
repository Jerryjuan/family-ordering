// 配置文件
module.exports = {
  // API 基础地址
  // 本地开发时使用 localhost
  // 手机预览时使用局域网 IP
  // 生产环境改为实际服务器地址（必须是 HTTPS）
  apiBaseUrl: 'http://192.168.31.4:3000/api',

  // 店铺信息
  shopInfo: {
    name: '温馨小厨房',
    slogan: '用心烹饪，美味每一餐'
  },

  // 订单状态映射
  orderStatusMap: {
    0: { text: '待处理', class: 'status-pending' },
    1: { text: '制作中', class: 'status-processing' },
    2: { text: '已完成', class: 'status-completed' },
    3: { text: '已取消', class: 'status-cancelled' }
  },

  // 页面配置
  pageSize: 20
};