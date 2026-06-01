// 数据统计页
const api = require('../../utils/request');
const util = require('../../utils/util');

Page({
  data: {
    overview: {
      todayOrders: 0,
      todayRevenue: '0.00',
      pendingOrders: 0,
      dishCount: 0
    },
    popularDishes: [],
    trendData: [],
    totalOrders7d: 0,
    totalRevenue7d: '0.00'
  },

  onLoad() {
    this.loadAllData();
  },

  onShow() {
    this.loadAllData();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadAllData();
    wx.stopPullDownRefresh();
  },

  // 加载所有数据
  async loadAllData() {
    await Promise.all([
      this.loadOverview(),
      this.loadPopular(),
      this.loadTrend()
    ]);
  },

  // 加载概览
  async loadOverview() {
    try {
      const res = await api.get('/stats/overview');
      const data = res.data;
      this.setData({
        overview: {
          todayOrders: data.todayOrders || 0,
          todayRevenue: (data.todayRevenue || 0).toFixed(2),
          pendingOrders: data.pendingOrders || 0,
          dishCount: data.dishCount || 0
        }
      });
    } catch (error) {
      console.error('加载概览失败:', error);
    }
  },

  // 加载热门菜品
  async loadPopular() {
    try {
      const res = await api.get('/stats/popular', { limit: 5, days: 30 });
      const dishes = res.data || [];

      // 计算条形图宽度
      const maxQuantity = dishes.length > 0 ? dishes[0].total_quantity : 1;
      const popularDishes = dishes.map(item => ({
        ...item,
        total_revenue: (item.total_revenue || 0).toFixed(2),
        barWidth: Math.max((item.total_quantity / maxQuantity) * 100, 5)
      }));

      this.setData({ popularDishes });
    } catch (error) {
      console.error('加载热门菜品失败:', error);
    }
  },

  // 加载趋势
  async loadTrend() {
    try {
      const res = await api.get('/stats/trend', { days: 7 });
      const trend = res.data || [];

      // 计算总计数
      const totalOrders = trend.reduce((sum, d) => sum + d.orders, 0);
      const totalRevenue = trend.reduce((sum, d) => sum + (d.revenue || 0), 0);

      // 计算柱状图高度
      const maxOrders = Math.max(...trend.map(d => d.orders), 1);
      const trendData = trend.map(item => {
        const date = new Date(item.date);
        return {
          ...item,
          revenue: (item.revenue || 0).toFixed(2),
          dayLabel: `${date.getMonth() + 1}/${date.getDate()}`,
          barHeight: Math.max((item.orders / maxOrders) * 100, 3)
        };
      });

      this.setData({
        trendData,
        totalOrders7d: totalOrders,
        totalRevenue7d: totalRevenue.toFixed(2)
      });
    } catch (error) {
      console.error('加载趋势失败:', error);
    }
  }
});