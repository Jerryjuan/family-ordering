// 订单详情页
const api = require('../../utils/request');
const util = require('../../utils/util');
const config = require('../../utils/config');

Page({
  data: {
    order: null,
    statusText: '',
    statusClass: '',
    statusIcon: ''
  },

  onLoad(options) {
    if (options.id) {
      this.loadOrder(options.id);
    }
  },

  // 加载订单详情
  async loadOrder(id) {
    try {
      util.showLoading('加载中...');
      const res = await api.get(`/orders/${id}`);
      util.hideLoading();

      const order = res.data;
      const statusInfo = config.orderStatusMap[order.status] || { text: '未知', class: '' };
      const statusIcons = { 0: '⏳', 1: '🍳', 2: '✅', 3: '❌' };

      this.setData({
        order,
        statusText: statusInfo.text,
        statusClass: statusInfo.class.replace('status-', ''),
        statusIcon: statusIcons[order.status] || '❓'
      });
    } catch (error) {
      util.hideLoading();
      console.error('加载订单失败:', error);
      util.showError('加载订单失败');
    }
  },

  // 再来一单
  onReorder() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});