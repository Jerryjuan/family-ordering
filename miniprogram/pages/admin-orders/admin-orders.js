// 订单管理页
const api = require('../../utils/request');
const util = require('../../utils/util');
const config = require('../../utils/config');

Page({
  data: {
    orders: [],
    currentTab: -1,
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
      const orders = (res.data || []).map(order => {
        const statusInfo = config.orderStatusMap[order.status] || { text: '未知', class: '' };
        return {
          ...order,
          statusText: statusInfo.text,
          statusClass: statusInfo.class.replace('status-', '')
        };
      });
      this.setData({ orders, loading: false });
    } catch (error) {
      console.error('加载订单失败:', error);
      this.setData({ loading: false });
    }
  },

  // 开始制作
  async onProcess(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await api.put(`/orders/${id}/status`, { status: 1 });
      util.showSuccess('已开始制作');
      this.loadOrders();
    } catch (error) {
      util.showError('操作失败');
    }
  },

  // 制作完成
  async onComplete(e) {
    const id = e.currentTarget.dataset.id;
    try {
      await api.put(`/orders/${id}/status`, { status: 2 });
      util.showSuccess('已完成');
      this.loadOrders();
    } catch (error) {
      util.showError('操作失败');
    }
  },

  // 取消订单
  onCancel(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.put(`/orders/${id}/status`, { status: 3 });
            util.showSuccess('已取消');
            this.loadOrders();
          } catch (error) {
            util.showError('操作失败');
          }
        }
      }
    });
  },

  // 查看详情
  onDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?id=${id}`
    });
  }
});