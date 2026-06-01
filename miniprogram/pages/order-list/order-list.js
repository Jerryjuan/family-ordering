// 订单列表页
const api = require('../../utils/request');
const util = require('../../utils/util');

Page({
  data: {
    orders: [],
    currentTab: -1, // -1 = 全部
    loading: true
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    this.loadOrders();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadOrders();
    wx.stopPullDownRefresh();
  },

  // 切换 Tab
  onTabChange(e) {
    const status = parseInt(e.currentTarget.dataset.status);
    this.setData({ currentTab: status });
    this.loadOrders();
  },

  // 加载订单列表
  async loadOrders() {
    try {
      this.setData({ loading: true });
      const params = {};
      if (this.data.currentTab >= 0) {
        params.status = this.data.currentTab;
      }
      const res = await api.get('/orders', params);
      this.setData({
        orders: res.data || [],
        loading: false
      });
    } catch (error) {
      console.error('加载订单失败:', error);
      this.setData({ loading: false });
    }
  },

  // 点击订单卡片
  onOrderTap(e) {
    const order = e.detail.order;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${order.id}`
    });
  }
});