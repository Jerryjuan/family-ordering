// 购物车底栏组件
const app = getApp();

Component({
  properties: {},

  data: {
    totalCount: 0,
    totalPrice: '0.00'
  },

  lifetimes: {
    attached() {
      this.updateCartInfo();
    }
  },

  pageLifetimes: {
    show() {
      this.updateCartInfo();
    }
  },

  methods: {
    // 更新购物车信息
    updateCartInfo() {
      const { totalPrice, totalCount } = app.getCartSummary();
      this.setData({
        totalCount,
        totalPrice: totalPrice.toFixed(2)
      });
    },

    // 点击购物车图标
    onCartTap() {
      wx.navigateTo({
        url: '/pages/cart/cart'
      });
    },

    // 去结算
    onCheckout() {
      if (this.data.totalCount === 0) {
        wx.showToast({ title: '购物车为空', icon: 'none' });
        return;
      }
      wx.navigateTo({
        url: '/pages/order/order'
      });
    }
  }
});