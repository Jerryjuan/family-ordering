// 首页 - 菜单列表
const api = require('../../utils/request');
const config = require('../../utils/config');
const util = require('../../utils/util');
const app = getApp();

Page({
  data: {
    shopName: '',
    shopSlogan: '',
    categories: [],
    dishes: [],
    currentCategory: 0, // 0 = 全部
    loading: true
  },

  onLoad() {
    this.setData({
      shopName: config.shopInfo.name,
      shopSlogan: config.shopInfo.slogan
    });
    this.loadCategories();
    this.loadDishes();
  },

  onShow() {
    // 每次显示时刷新菜品（购物车数量可能变了）
    if (this.data.dishes.length > 0) {
      this.setData({ dishes: [...this.data.dishes] });
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadCategories();
    this.loadDishes();
    wx.stopPullDownRefresh();
  },

  // 加载分类
  async loadCategories() {
    try {
      const res = await api.get('/categories');
      this.setData({ categories: res.data || [] });
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  },

  // 加载菜品
  async loadDishes() {
    try {
      this.setData({ loading: true });
      const params = { status: 1 }; // 只显示上架的
      if (this.data.currentCategory > 0) {
        params.category_id = this.data.currentCategory;
      }
      const res = await api.get('/dishes', params);
      this.setData({
        dishes: res.data || [],
        loading: false
      });
    } catch (error) {
      console.error('加载菜品失败:', error);
      this.setData({ loading: false });
      util.showError('加载菜品失败');
    }
  },

  // 切换分类
  onCategoryTap(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    this.setData({ currentCategory: id });
    this.loadDishes();
  },

  // 购物车变化
  onCartChange() {
    // 强制更新页面数据以刷新组件
    this.setData({ dishes: [...this.data.dishes] });
  }
});