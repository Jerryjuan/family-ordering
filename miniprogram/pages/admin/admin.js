// 管理端入口
const api = require('../../utils/request');

Page({
  data: {
    pendingCount: 0,
    processingCount: 0,
    dishCount: 0
  },

  onShow() {
    this.loadStats();
  },

  // 加载统计数据
  async loadStats() {
    try {
      const res = await api.get('/stats/overview');
      const data = res.data;
      this.setData({
        pendingCount: data.pendingOrders || 0,
        processingCount: data.processingOrders || 0,
        dishCount: data.dishCount || 0
      });
    } catch (error) {
      console.error('加载统计失败:', error);
    }
  },

  goToDishes() {
    wx.navigateTo({ url: '/pages/admin-dishes/admin-dishes' });
  },

  goToOrders() {
    wx.navigateTo({ url: '/pages/admin-orders/admin-orders' });
  },

  goToStats() {
    wx.navigateTo({ url: '/pages/admin-stats/admin-stats' });
  }
});