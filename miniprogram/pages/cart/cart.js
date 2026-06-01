// 购物车页
const app = getApp();

Page({
  data: {
    cartItems: [],
    totalPrice: '0.00',
    totalCount: 0
  },

  onShow() {
    this.loadCart();
  },

  // 加载购物车数据
  loadCart() {
    const cart = app.globalData.cart;
    const { totalPrice, totalCount } = app.getCartSummary();
    this.setData({
      cartItems: cart,
      totalPrice: totalPrice.toFixed(2),
      totalCount
    });
  },

  // 增加数量
  onAdd(e) {
    const { id, name, price } = e.currentTarget.dataset;
    app.addToCart({ id, name, price });
    this.loadCart();
  },

  // 减少数量
  onReduce(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    app.reduceFromCart(id);
    this.loadCart();
  },

  // 清空购物车
  onClearCart() {
    wx.showModal({
      title: '提示',
      content: '确定清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearCart();
          this.loadCart();
        }
      }
    });
  },

  // 去结算
  onCheckout() {
    if (this.data.cartItems.length === 0) {
      return;
    }
    wx.navigateTo({
      url: '/pages/order/order'
    });
  },

  // 去点餐
  goToMenu() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});